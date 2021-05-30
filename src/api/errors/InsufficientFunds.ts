import { HttpError } from 'routing-controllers';

export class InsufficientFunds extends HttpError {
	constructor() {
		super(403, 'Insufficient funds ');
	}
}
