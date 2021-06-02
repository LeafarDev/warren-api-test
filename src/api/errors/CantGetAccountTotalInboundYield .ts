import {HttpError} from 'routing-controllers';

export class CantGetAccountTotalInboundYield extends HttpError {
	constructor() {
		super(500, 'Could not get the total inbound yield');
	}
}
