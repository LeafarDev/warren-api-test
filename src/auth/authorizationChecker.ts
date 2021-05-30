import {Action} from 'routing-controllers';
import {Container} from "typedi";
import {Connection} from 'typeorm';
import {AuthService} from "./AuthService";

export function authorizationChecker(connection: Connection): (action: Action, roles: any[]) => Promise<boolean> | boolean {
    const authService = Container.get<AuthService>(AuthService);

    return async function innerAuthorizationChecker(action: Action, roles: string[]): Promise<boolean> {
        const credentials = await authService.parseTokenAuthFromRequest(action.request);

        if (credentials === undefined) {
            return false;
        }
        return true;
    };
}
