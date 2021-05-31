import "reflect-metadata";
import {createExpressServer} from 'routing-controllers';
import {Connection, createConnection, useContainer} from "typeorm";
import {Container} from "typeorm-typedi-extensions";
import {DailyInboundYieldCron} from "./api/crons/DailyInboundYieldCron";
import {authorizationChecker} from "./auth/authorizationChecker";
import {currentUserChecker} from './auth/currentUserChecker';
import connectionOptions from './database/ormconfig';
import {env} from "./env";
import {SubscriberLoader} from "./loaders/SubscriberLoader";

useContainer(Container);
new SubscriberLoader().execute();
new DailyInboundYieldCron().execute();

createConnection(connectionOptions).then((connection: Connection): void | PromiseLike<void> => {
	const app = createExpressServer({
		classTransformer: true,
		defaults: {
			nullResultCode: 404,
			undefinedResultCode: 204,
			paramOptions: {
				required: true
			}
		},
		routePrefix: env.app.routePrefix,
		cors: true,
		controllers: env.app.dirs.controllers,
		validation: true,
		middlewares: env.app.dirs.middlewares,
		authorizationChecker: authorizationChecker(connection),
		currentUserChecker: currentUserChecker(connection)
	});
	app.listen(env.app.port);
}).catch(error => console.log(error));
