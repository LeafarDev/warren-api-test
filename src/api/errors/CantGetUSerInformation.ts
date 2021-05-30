import { HttpError } from 'routing-controllers';

export class CantGetUSerInformation extends HttpError {
	constructor() {
		super(500, 'Could not get the user information, please try again later');
	}
}
