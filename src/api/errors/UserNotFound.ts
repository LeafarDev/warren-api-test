import {HttpError} from 'routing-controllers';

export class UserNotFound extends HttpError {
	constructor() {
		super(404, 'User not found');
	}
}
