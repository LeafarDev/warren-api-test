import {HttpError} from "routing-controllers";
import {Connection} from 'typeorm';
import {runSeeder} from 'typeorm-seeding';
import {Container} from "typeorm-typedi-extensions";
import {AccountDestinationAndSourceAreEqual} from "../../src/api/errors/AccountDestinationAndSourceAreEqual";
import {AccountDestinationNotFound} from "../../src/api/errors/AccountDestinationNotFound";
import {InsufficientFunds} from "../../src/api/errors/InsufficientFunds";
import {TransactionAccountDestinationNeeded} from "../../src/api/errors/TransactionAccountDestinationNeeded";
import {TransactionSourceAccountIsIncorrect} from "../../src/api/errors/TransactionSourceAccountIsIncorrect";
import {Transaction, TransactionType} from '../../src/api/models/Transaction';
import {User} from "../../src/api/models/User";
import {TransactionService} from '../../src/api/services/TransactionService';
import {CreateMarciano} from '../../src/database/seeds/CreateMarciano';
import {closeDatabase, createDatabaseConnection, dropDatabase, migrateDatabase} from '../utils/database';

describe('TransactionService', () => {
	let marciano: User;
	let connection: Connection;
	let service: TransactionService;

	beforeAll(async () => {
		connection = await createDatabaseConnection();
		service = Container.get(TransactionService);
	});

	beforeEach(async () => {
		await migrateDatabase(connection);
		marciano = await runSeeder(CreateMarciano);
	});

	afterEach(async () => {
		await dropDatabase(connection);
	});

	afterAll(async () => {
		await closeDatabase(connection);
	});

	test('should create a new transaction in the database', async () => {
		const transaction = new Transaction();
		transaction.sourceAccountNumber = marciano.account.accountNumber;
		transaction.targetAccountNumber = null;
		transaction.amount = 0.0001;
		transaction.type = TransactionType.withdraw;
		const resultCreate = await service.create(transaction, marciano.id);
		expect(resultCreate.sourceAccountNumber).toBe(transaction.sourceAccountNumber);
		expect(resultCreate.amount).toBe(transaction.amount);
		expect(resultCreate.type).toBe(transaction.type);

		const resultFind = await service.findOne(resultCreate.id);
		if (resultFind) {
			expect(resultFind.sourceAccountNumber).toBe(transaction.sourceAccountNumber);
			expect(resultFind.amount).toBe(transaction.amount);
			expect(resultFind.type).toBe(transaction.type);
		} else {
			throw new Error('Could not find transaction');
		}
	});

	test('Should return error when the destination account is null in a payment', async () => {
		const transaction = new Transaction();
		transaction.sourceAccountNumber = marciano.account.accountNumber;
		transaction.targetAccountNumber = null;
		transaction.amount = 0.0001;
		transaction.type = TransactionType.payment;
		try {
			await service.create(transaction, marciano.id);
			throw new Error('The method did not return any error');
		} catch (error) {
			const expectedError = new TransactionAccountDestinationNeeded();
			expect(error).toBeInstanceOf(HttpError);
			expect(error.message).toBe(expectedError.message);
		}
	});

	test('Should return error when the source account is different of the current user account', async () => {
		const transaction = new Transaction();
		transaction.sourceAccountNumber = '15369857';
		transaction.targetAccountNumber = null;
		transaction.amount = 1000;
		transaction.type = TransactionType.withdraw;
		try {
			await service.create(transaction, marciano.id);
			throw new Error('The method did not return any error');
		} catch (error) {
			const expectedError = new TransactionSourceAccountIsIncorrect();
			expect(error).toBeInstanceOf(HttpError);
			expect(error.message).toBe(expectedError.message);
		}
	});

	test('Should return error when source and destination account is equal in a payment', async () => {
		const transaction = new Transaction();
		transaction.sourceAccountNumber = marciano.account.accountNumber;
		transaction.targetAccountNumber = marciano.account.accountNumber;
		transaction.amount = 0.0001;
		transaction.type = TransactionType.payment;

		try {
			await service.create(transaction, marciano.id);
			throw new Error('The method did not return any error');
		} catch (error) {
			const expectedError = new AccountDestinationAndSourceAreEqual();
			expect(error).toBeInstanceOf(HttpError);
			expect(error.message).toBe(expectedError.message);
		}
	});

	test('Should return error when the user account does not have funds', async () => {
		const transaction = new Transaction();
		transaction.sourceAccountNumber = marciano.account.accountNumber;
		transaction.targetAccountNumber = null;
		transaction.amount = marciano.account.balance + 1;
		transaction.type = TransactionType.withdraw;
		try {
			await service.create(transaction, marciano.id);
			throw new Error('The method did not return any error');
		} catch (error) {
			const expectedError = new InsufficientFunds();
			expect(error).toBeInstanceOf(HttpError);
			expect(error.message).toBe(expectedError.message);
		}
	});

	test('Should return error when the destination account does not exist', async () => {
		const transaction = new Transaction();
		transaction.sourceAccountNumber = marciano.account.accountNumber;
		transaction.targetAccountNumber = '99999991';
		transaction.amount = 0.0001;
		transaction.type = TransactionType.payment;
		try {
			await service.create(transaction, marciano.id);
			throw new Error('The method did not return any error');
		} catch (error) {
			const expectedError = new AccountDestinationNotFound();
			expect(error).toBeInstanceOf(HttpError);
			expect(error.message).toBe(expectedError.message);
		}
	});

	test('should return transaction list by userId', async () => {
		const resultFind = await service.findByUserId(marciano.id);
		expect(resultFind.length).toBe(1);
	});

	test('should return a transaction by its id', async () => {
		const transaction = new Transaction();
		transaction.sourceAccountNumber = marciano.account.accountNumber;
		transaction.targetAccountNumber = null;
		transaction.amount = 0.0001;
		transaction.type = TransactionType.withdraw;
		const resultTransactionCreate = await service.create(transaction, marciano.id);

		const resultFind = await service.findOne(resultTransactionCreate.id);
		expect(resultFind).toBeDefined();
	});
});
