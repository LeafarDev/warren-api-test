import { HttpError } from 'routing-controllers';

export class TransactionSourceAccountIsIncorrect extends HttpError {
	constructor() {
		super(403, 'The source account did not match with the current user account');
	}
}
