import {Request} from "express";
import jwt from "jsonwebtoken";
import {User} from "../../../src/api/models/User";
import {AuthService} from "../../../src/auth/AuthService";
import {env} from "../../../src/env";
import {RepositoryMock} from "../lib/RepositoryMock";

describe('AuthService', () => {
	let authService: AuthService;
	let userRepository: RepositoryMock<User>;

	beforeEach(() => {
		userRepository = new RepositoryMock<User>();
		authService = new AuthService(userRepository as any);
	});
	describe('parseTokenFromRequest', () => {
		test('Should return the userId of authorization header', async () => {
			const token: string = jwt.sign({id: 'b7e4a48c-a8c9-429f-a2a3-46553ae11100'}, env.authConfig.secret, {
				expiresIn: env.authConfig.expiresIn
			});
			const req = {
				headers: {
					authorization: `Bearer ${token}`
				}
			} as Request;
			const credentials = await authService.parseTokenAuthFromRequest(req);
			expect(credentials.id).toBe('b7e4a48c-a8c9-429f-a2a3-46553ae11100');
		});

		test('Should return undefined if there is no authorization header', async () => {
			const req = {
				headers: {}
			} as Request;

			const decoded  = await authService.parseTokenAuthFromRequest(req);
			expect(decoded).toBeUndefined();
		});

		test('Should return undefined if there is a invalid basic authorization header', async () => {
			const req = {
				headers: {authorization: 'Bearer amoeba'}
			} as Request;

			const decoded  = await authService.parseTokenAuthFromRequest(req);
			expect(decoded).toBeUndefined();
		});
	});
});
