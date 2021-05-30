import {HttpError} from 'routing-controllers';

export class TransactionAccountDestinationNeeded extends HttpError {
	constructor() {
		super(403, 'Account destination needed in this type of transaction');
	}
}
