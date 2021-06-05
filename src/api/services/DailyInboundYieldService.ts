import axios from "axios";
import currency from "currency.js";
import logger from "node-color-log";
import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions";
import {EventDispatcher, EventDispatcherInterface} from "../../decorators/EventDispatcher";
import {env} from "../../env";
import {isLeapYear} from "../../lib/date";
import {CantGetAccountTotalInboundYield} from "../errors/CantGetAccountTotalInboundYield ";
import {DailyInboundYield} from "../models/DailyInboundYield";
import {AccountRepository} from "../repositories/AccountRepository";
import {DailyInboundYieldRepository} from "../repositories/DailyInboundYieldRepository";
import {UserRepository} from "../repositories/UserRepository";
import {events} from "../subscribers/events";
import {SelicData} from "../types/SelicData";
import {UserTotalInboundYield} from "../types/UserTotalInboundYield";

@Service()
export class DailyInboundYieldService {

	constructor(@InjectRepository() private dailyInboundYieldRepository: DailyInboundYieldRepository,
		@InjectRepository() private accountRepository: AccountRepository,
		@InjectRepository() private userRepository: UserRepository,
		@EventDispatcher() private eventDispatcher: EventDispatcherInterface) {
	}

	public async handleDailyInboundYieldCron(): Promise<void> {
		const leapYear: boolean = isLeapYear(new Date());
		const numberOfDays = leapYear ? 366 : 365;
		const accounts = await this.accountRepository.find();
		axios.get<SelicData[]>(env.publicApis.bcbSelic).then(async (response) => {
			const {data}: { data: SelicData[] } = response;
			const [selicData] = data;
			const decimalRate = currency(selicData.valor, {precision: 4}).divide(100).value;
			const dailySelicRate = currency(decimalRate, {precision: 19}).divide(numberOfDays).value;

			for (const account of accounts) {
				try {
					const dailyInboundYield = new DailyInboundYield();
					dailyInboundYield.amount = currency(account.balance, {precision: 4}).multiply(dailySelicRate).value;
					dailyInboundYield.account = account;
					const createdDailyInboundYield = await this.dailyInboundYieldRepository.save(dailyInboundYield);
					this.eventDispatcher.dispatch(events.dailyInboundYield.created, createdDailyInboundYield);
				} catch (error) {
					logger.fontColorLog('red', error.message);
				}
			}
		}).catch((error) => {
			logger.fontColorLog('red', error.message);
		});
	}

	public async getAccountTotalInboundYield (userId: string): Promise<UserTotalInboundYield> {
		try {
			const user = await this.userRepository.findOne({id: userId}, {relations: ['account']});
			return this.dailyInboundYieldRepository.getAccountTotalInboundYield(user.account.id);
		} catch (error) {
			logger.fontColorLog('red', error.message);
			throw new CantGetAccountTotalInboundYield;
		}

	}

}
