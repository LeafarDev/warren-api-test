import {Connection, createConnection, useContainer} from 'typeorm';
import {Container} from "typeorm-typedi-extensions";
import {env} from '../../src/env';

export const createDatabaseConnection = async (): Promise<Connection> => {
	useContainer(Container);
	const connection = await createConnection({
		type: 'postgres',
		host: env.db.host,
		port: env.db.port,
		username: env.db.username,
		password: env.db.password,
		database: env.db.database,
		entities: env.app.dirs.entities,
		migrations: env.app.dirs.migrations
	});
	return connection;
};

export const dropDatabase = async (connection: Connection) => {
	return connection.dropDatabase();
	//return connection.synchronize(true);
};

export const migrateDatabase = async (connection: Connection) => {
	await connection.dropDatabase();
	return connection.runMigrations();
};

export const closeDatabase = (connection: Connection) => {
	return connection.close();
};
