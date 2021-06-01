import {HttpError} from 'routing-controllers';

export class CantGetTransaction extends HttpError {
	constructor() {
		super(500, 'Could not get the transaction, please try again later');
	}
}
