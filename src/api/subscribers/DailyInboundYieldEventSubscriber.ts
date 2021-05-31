import {EventSubscriber, On} from 'event-dispatch';
import {Container} from "typeorm-typedi-extensions";
import {DailyInboundYield} from '../models/DailyInboundYield';
import {AccountService} from "../services/AccountService";
import {events} from './events';


@EventSubscriber()
export class DailyInboundYieldEventSubscriber {
	private accountService: AccountService;

	constructor() {
		this.accountService = Container.get(AccountService);
	}

	@On(events.dailyInboundYield.created)
	public async onDailyInboundYieldCreate(dailyInboundYield: DailyInboundYield): Promise<void> {
		await this.accountService.handleBalanceOnDailyInboundYieldCreate(dailyInboundYield);
	}

}
