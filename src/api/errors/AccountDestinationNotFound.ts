import { HttpError } from 'routing-controllers';

export class AccountDestinationNotFound extends HttpError {
	constructor() {
		super(404, 'Account destination not found');
	}
}
