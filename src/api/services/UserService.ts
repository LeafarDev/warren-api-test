import {Service} from 'typedi';
import {InjectRepository} from "typeorm-typedi-extensions";
import {User} from '../models/User';
import {UserRepository} from '../repositories/UserRepository';

@Service()
export class UserService {
	constructor(
		@InjectRepository() private userRepository: UserRepository
	) {}

	public findOne(id: string): Promise<User | undefined> {
		return this.userRepository.findOne({id}, {relations: ['account']});
	}
}
