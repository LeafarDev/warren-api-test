import {join} from 'path';

export function getOsEnv(key: string): string {
	if (typeof process.env[key] === 'undefined') {
		throw new Error(`Environment variable ${key} is not set.`);
	}

	return process.env[key] as string;
}

export function getOsEnvOptional(key: any): string | undefined {
	return process.env[key];
}

export function getPath(path: string): string {
	return (process.env.NODE_ENV === 'production')
		? join(process.cwd(), path.replace('src/', 'dist/src/').slice(0, -3) + '.js')
		: join(process.cwd(), path);
}

export function getPaths(paths: string[]): string[] {
	return paths.map(p => getPath(p));
}

export function getOsPath(key: string): string {
	return getPath(getOsEnv(key));
}

export function getOsPaths(key: string): string[] {
	return getPaths(getOsEnvArray(key));
}

export function getOsEnvArray(key: string, delimiter = ','): string[] {
	return getOsEnv(key) && getOsEnv(key).split(delimiter) || [];
}

export function toNumber(value: any): number {
	return parseInt(value, 10);
}

export function toBool(value: string | undefined): boolean {
	return value === 'true';
}

export function normalizePort(port: string): number | string | boolean {
	const parsedPort = parseInt(port, 10);
	if (isNaN(parsedPort)) {
		return port;
	}
	if (parsedPort >= 0) {
		return parsedPort;
	}
	return false;
}
