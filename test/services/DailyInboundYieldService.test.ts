import {Connection} from "typeorm";
import {Container} from "typeorm-typedi-extensions";
import {Account} from "../../src/api/models/Account";
import {DailyInboundYield} from "../../src/api/models/DailyInboundYield";
import {User} from "../../src/api/models/User";
import {DailyInboundYieldService} from "../../src/api/services/DailyInboundYieldService";
import {UserTotalInboundYield} from "../../src/api/types/UserTotalInboundYield";
import {closeDatabase, createDatabaseConnection, migrateDatabase} from "../utils/database";

describe('DailyInboundYieldService', () => {
	let connection: Connection;
	let service: DailyInboundYieldService;

	beforeAll(async () => {
		connection = await createDatabaseConnection();
		service = Container.get(DailyInboundYieldService);
	});

	beforeEach(async () => {
		await migrateDatabase(connection);
	});

	afterAll(async () => {
		await closeDatabase(connection);
	});

	test('Should return the total of account inbound yield', async () => {
		const dailyInboundYieldAmount = 1000;

		const em = connection.createEntityManager();
		const account = new Account();
		account.balance = dailyInboundYieldAmount;
		account.accountNumber = '12345678';
		const createdAccount = await em.save(account);

		const dailyInboundYield = new DailyInboundYield();
		dailyInboundYield.account = createdAccount;
		dailyInboundYield.amount = dailyInboundYieldAmount;
		const createdDailyInboundYield = await em.save(dailyInboundYield);

		const user = new User();
		user.name = 'John Doe';
		user.email = 'john.doe@gmail.com';
		user.password = '12345678';
		user.account = createdAccount;
		const userCreated = await em.save(user);

		const result: UserTotalInboundYield = await service.getAccountTotalInboundYield(userCreated.id);
		expect(createdDailyInboundYield.amount).toBe(result.total);
	});
});
