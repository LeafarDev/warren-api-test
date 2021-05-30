import {HttpError} from 'routing-controllers';

export class AccountDestinationAndSourceAreEqual extends HttpError {
	constructor() {
		super(403, 'Account source and destination should not be equal in this type of transaction');
	}
}
