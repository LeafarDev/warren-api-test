import logger from "node-color-log";
import {Service} from 'typedi';
import {InjectRepository} from "typeorm-typedi-extensions";
import {CantGetUSerInformation} from "../errors/CantGetUSerInformation";
import {User} from '../models/User';
import {UserRepository} from '../repositories/UserRepository';

@Service()
export class UserService {
	constructor(
		@InjectRepository() private userRepository: UserRepository
	) {
	}

	public async findOne(id: string): Promise<User | undefined> {
		try {
			return this.userRepository.findOne({id}, {relations: ['account']});
		} catch (error) {
			logger.fontColorLog('red', error.message);
			throw new CantGetUSerInformation;
		}
	}
}
