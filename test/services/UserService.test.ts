import {Connection} from "typeorm";
import {runSeeder} from "typeorm-seeding";
import {Container} from "typeorm-typedi-extensions";
import {User} from "../../src/api/models/User";
import {UserService} from "../../src/api/services/UserService";
import {CreateMarciano} from "../../src/database/seeds/CreateMarciano";
import {closeDatabase, createDatabaseConnection, migrateDatabase} from "../utils/database";

describe('UserService', () => {
	let connection: Connection;
	let service: UserService;
	let marciano: User;

	beforeAll(async () => {
		connection = await createDatabaseConnection();
		service = Container.get(UserService);
	});

	beforeEach(async () => {
		await migrateDatabase(connection);
		marciano = await runSeeder(CreateMarciano);
	});

	afterAll(async () => {
		await closeDatabase(connection);
	});

	test('should return a user by its id', async () => {
		const resultFind = await service.findOne(marciano.id);
		expect(resultFind).toBeDefined();
	});
});
