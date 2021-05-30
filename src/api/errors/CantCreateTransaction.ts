import {HttpError} from 'routing-controllers';

export class CantCreateTransaction extends HttpError {
	constructor() {
		super(500, 'Could not create the transaction, please try again later');
	}
}
