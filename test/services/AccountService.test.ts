import currency from "currency.js";
import {Connection} from "typeorm";
import {runSeeder} from "typeorm-seeding";
import {Container} from "typeorm-typedi-extensions";
import {DailyInboundYield} from "../../src/api/models/DailyInboundYield";
import {Transaction, TransactionType} from "../../src/api/models/Transaction";
import {User} from "../../src/api/models/User";
import {AccountService} from "../../src/api/services/AccountService";
import {UserService} from "../../src/api/services/UserService";
import {CreateDumingaz} from "../../src/database/seeds/CreateDumingaz";
import {CreateMarciano} from "../../src/database/seeds/CreateMarciano";
import {closeDatabase, createDatabaseConnection, dropDatabase, migrateDatabase} from "../utils/database";

describe('AccountService', () => {
	let connection: Connection;
	let transactionService: AccountService;
	let userService: UserService;
	let marciano: User;
	let dumingaz: User;

	beforeAll(async () => {
		connection = await createDatabaseConnection();
		transactionService = Container.get(AccountService);
		userService = Container.get(UserService);
	});

	beforeEach(async () => {
		await migrateDatabase(connection);
		marciano = await runSeeder(CreateMarciano);
		dumingaz = await runSeeder(CreateDumingaz);
	});

	afterEach(async () => {
		await dropDatabase(connection);
	});

	afterAll(async () => {
		await dropDatabase(connection);
		await closeDatabase(connection);
	});

	test('should increase balance when calls the function handleBalanceOnDailyInboundYieldCreate', async () => {
		const dailyInboundYieldAmount = 500;
		const em = connection.createEntityManager();
		const dailyInboundYield = new DailyInboundYield();
		dailyInboundYield.account = marciano.account;
		dailyInboundYield.amount = dailyInboundYieldAmount;
		const createdDailyInboundYield = await em.save(dailyInboundYield);

		await transactionService.handleBalanceOnDailyInboundYieldCreate(createdDailyInboundYield);
		const updatedMarciano = await userService.findOne(marciano.id);
		const expectedBalance = currency(marciano.account.balance, {precision: 4}).add(dailyInboundYieldAmount).value;
		expect(updatedMarciano.account.balance).toBe(expectedBalance);
	});

	test('When a payment is created the source account balance should be decreased and the target account balance increased.', async () => {
		const paymentAmount = 50;
		const em = connection.createEntityManager();

		const transaction = new Transaction();
		transaction.sourceAccountNumber = marciano.account.accountNumber;
		transaction.targetAccountNumber = dumingaz.account.accountNumber;
		transaction.amount = paymentAmount;
		transaction.type = TransactionType.payment;
		const createdTransaction = await em.save(transaction);

		await transactionService.handleBalanceOnTransactionCreate(createdTransaction);
		const expectedDecreaseBalance = currency(marciano.account.balance, {precision: 4}).subtract(paymentAmount).value;
		const expectedIncreaseBalance = currency(dumingaz.account.balance, {precision: 4}).add(paymentAmount).value;

		const updatedMarciano = await userService.findOne(marciano.id);
		const updatedDumingaz = await userService.findOne(dumingaz.id);

		expect(updatedMarciano.account.balance).toBe(expectedDecreaseBalance);
		expect(updatedDumingaz.account.balance).toBe(expectedIncreaseBalance);
	});

	test('When a withdraw is created the source account balance should be decreased', async () => {
		const withdrawAmount = 50;
		const em = connection.createEntityManager();

		const transaction = new Transaction();
		transaction.sourceAccountNumber = marciano.account.accountNumber;
		transaction.targetAccountNumber = null;
		transaction.amount = withdrawAmount;
		transaction.type = TransactionType.withdraw;
		const createdTransaction = await em.save(transaction);

		const expectedBalance = currency(marciano.account.balance, {precision: 4}).subtract(withdrawAmount).value;

		await transactionService.handleBalanceOnTransactionCreate(createdTransaction);
		const updatedMarciano = await userService.findOne(marciano.id);
		expect(updatedMarciano.account.balance).toBe(expectedBalance);
	});

	test('When a deposit is created the source account balance should be decreased', async () => {
		const depositAmount = 5000;
		const em = connection.createEntityManager();

		const transaction = new Transaction();
		transaction.sourceAccountNumber = marciano.account.accountNumber;
		transaction.targetAccountNumber = null;
		transaction.amount = depositAmount;
		transaction.type = TransactionType.deposit;
		const createdTransaction = await em.save(transaction);

		const expectedBalance = currency(marciano.account.balance, {precision: 4}).add(depositAmount).value;

		await transactionService.handleBalanceOnTransactionCreate(createdTransaction);
		const updatedMarciano = await userService.findOne(marciano.id);
		expect(updatedMarciano.account.balance).toBe(expectedBalance);
	});
});
