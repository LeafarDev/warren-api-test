import {HttpError} from 'routing-controllers';

export class CantGetTransactionList extends HttpError {
	constructor() {
		super(500, 'Could not get the transaction list, please try again later');
	}
}
