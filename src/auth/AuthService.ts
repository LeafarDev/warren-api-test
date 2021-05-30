import {InjectRepository} from "typeorm-typedi-extensions";
import * as express from 'express';
import {UserRepository} from "../api/repositories/UserRepository";
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {env} from "../env";
import {Service} from "typedi";
import {promisify} from "util";
import {IncorrectCredentials} from "../api/errors/IncorrectCredentials";

@Service()
export class AuthService {
    constructor(
        @InjectRepository() private userRepository: UserRepository
    ) {
    }

    public async decodeToken(token: string): Promise<{ id: string }> {
        // @ts-ignore
        return promisify(jwt.verify)(token, env.authConfig.secret) as { id };
    }

    public async parseTokenAuthFromRequest(req: express.Request): Promise<{ id: string }> {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return undefined;
        }
        try {
            const [, token] = authHeader.split(' ');

            const decoded = await this.decodeToken(token);

            return {id: decoded.id};
        } catch (_) {
            return undefined;
        }
    }

    async validateUserPassword(email: string, password: string): Promise<string | undefined> {
        const user = await this.userRepository.findOne({email});
        if (user) {
            const authCompareResult: boolean = await bcrypt.compare(password, user.password);
            if (authCompareResult) {
                const token: string = jwt.sign({id: user.id}, env.authConfig.secret, {
                    expiresIn: env.authConfig.expiresIn
                });
                return token;
            }
        }
        throw new IncorrectCredentials;
    }
}
