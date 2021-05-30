import { HttpError } from 'routing-controllers';

export class IncorrectCredentials extends HttpError {
    constructor() {
        super(401, 'Username or password incorrect');
    }
}
