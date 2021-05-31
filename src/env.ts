import * as dotenv from 'dotenv';
import * as path from 'path';

import {getOsEnv, getOsEnvOptional, getOsPath, getOsPaths, normalizePort, toBool, toNumber} from './lib/env';

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({path: path.join(process.cwd(), `.env${((process.env.NODE_ENV === 'test') ? '.test' : '')}`)});

/**
 * Environment variables
 */
export const env = {
	node: process.env.NODE_ENV || 'development',
	isProduction: process.env.NODE_ENV === 'production',
	isTest: process.env.NODE_ENV === 'test',
	isDevelopment: process.env.NODE_ENV === 'development',
	authConfig: {
		secret: getOsEnv('SECRET_TOKEN'),
		expiresIn: getOsEnv('EXPIRE_TOKEN')
	},
	app: {
		routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
		port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
		dirs: {
			migrations: getOsPaths('TYPEORM_MIGRATIONS'),
			migrationsDir: getOsPath('TYPEORM_MIGRATIONS_DIR'),
			entities: getOsPaths('TYPEORM_ENTITIES'),
			entitiesDir: getOsPath('TYPEORM_ENTITIES_DIR'),
			controllers: getOsPaths('CONTROLLERS'),
			middlewares: getOsPaths('MIDDLEWARES'),
			subscribers: getOsPaths('SUBSCRIBERS')
		}
	},
	publicApis: {
		bcbSelic: process.env.BCB_SELIC_API_URL
	},
	db: {
		type: getOsEnv('TYPEORM_CONNECTION'),
		host: getOsEnvOptional('TYPEORM_HOST'),
		port: toNumber(getOsEnvOptional('TYPEORM_PORT')),
		username: getOsEnvOptional('TYPEORM_USERNAME'),
		password: getOsEnvOptional('TYPEORM_PASSWORD'),
		database: getOsEnv('TYPEORM_DATABASE'),
		synchronize: toBool(getOsEnvOptional('TYPEORM_SYNCHRONIZE'))
	}
};
