import {IsEmail, MinLength} from "class-validator";
import {Body, JsonController, OnUndefined, Post} from 'routing-controllers';
import {AuthService} from '../../auth/AuthService';
import {Container} from "typeorm-typedi-extensions";
import {IncorrectCredentials} from "../errors/IncorrectCredentials";


class AuthBody {
	@IsEmail()
	public email: string;

	@MinLength(8)
	public password: string;
}


@JsonController()
export class AuthController {
	private authService: AuthService;

	constructor() {
		this.authService = Container.get(AuthService);
	}

	@Post('/login')
	@OnUndefined(IncorrectCredentials)
	async post(@Body({required: true, validate: true}) body: AuthBody) {
		const token = await this.authService.validateUserPassword(body.email, body.password);
		if (token !== undefined) {
			return {token: `Bearer ${token}`};
		}
		return token;
	}

}
