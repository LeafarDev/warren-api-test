import * as express from 'express';
import {ExpressMiddlewareInterface, Middleware} from 'routing-controllers';
import {Container} from "typeorm-typedi-extensions";
import {AuthService} from "../../auth/AuthService";

@Middleware({type: 'before'})
export class UserIdWrapper implements ExpressMiddlewareInterface {
	private authService: AuthService;

	public async use(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
		this.authService = Container.get(AuthService);

		const parsed = await this.authService.parseTokenAuthFromRequest(req);
		if (parsed === undefined) {
			return res.status(401).json({error: 'Invalid token'});
		}

		// @ts-ignore
		req.userId = parsed.id;

		return next();
	}
}
