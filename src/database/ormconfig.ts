import {ConnectionOptions} from 'typeorm';
import {env} from '../env';

const config = {
	host: env.db.host,
	user: env.db.username,
	port: env.db.port,
	password: env.db.password,
	database: env.db.database
};

const connectionOptions: ConnectionOptions = {
	type: 'postgres',
	host: config.host,
	port: config.port,
	username: config.user || 'postgres',
	password: config.password || 'postgres',
	database: config.database || 'my_database',
	entities: env.app.dirs.entities,
	synchronize: false,
	dropSchema: false,
	migrationsRun: true,
	logging: ['warn', 'error'],
	logger: env.isProduction ? 'file' : 'debug',
	migrations: env.app.dirs.migrations,
	cli: {
		migrationsDir: env.app.dirs.migrationsDir
	}
};

export = connectionOptions
