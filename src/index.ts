import "reflect-metadata";
import {Connection, createConnection, useContainer} from "typeorm";
import {createExpressServer} from 'routing-controllers';
import connectionOptions from './database/ormconfig';
import {env} from "./env";
import {Container} from "typeorm-typedi-extensions";
import {authorizationChecker} from "./auth/authorizationChecker";
import {currentUserChecker} from './auth/currentUserChecker';

useContainer(Container);
createConnection(connectionOptions).then((connection: Connection): void | PromiseLike<void> => {
    const app = createExpressServer({
        classTransformer: true,
        defaults: {
            nullResultCode: 404,
            undefinedResultCode: 204,
            paramOptions: {
                required: true,
            },
        },
        routePrefix: env.app.routePrefix,
        cors: true,
        controllers: env.app.dirs.controllers,
        middlewares: env.app.dirs.middlewares,
        interceptors: env.app.dirs.interceptors,
        authorizationChecker: authorizationChecker(connection),
        currentUserChecker: currentUserChecker(connection),
    });
    app.listen(env.app.port);
}).catch(error => console.log(error));
