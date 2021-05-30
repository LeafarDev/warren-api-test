import {Authorized, Get, JsonController, Req, UseBefore} from 'routing-controllers';
import {Container} from "typeorm-typedi-extensions";
import {UserIdWrapper} from "../middlewares/UserIdWrapper";
import {User} from "../models/User";
import {UserService} from '../services/UserService';

@Authorized()
@JsonController()
export class UserController {
	private userService: UserService;

	constructor() {
		this.userService = Container.get(UserService);
	}

	@Get('/users/me')
	@UseBefore(UserIdWrapper)
	findMe(@Req() req: any): Promise<User> {
		const {userId} = req;
		return this.userService.findOne(userId);
	}
}
