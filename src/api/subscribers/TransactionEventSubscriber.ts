import {EventSubscriber, On} from 'event-dispatch';
import {Container} from "typeorm-typedi-extensions";
import {Transaction} from '../models/Transaction';
import {AccountService} from "../services/AccountService";
import {events} from './events';


@EventSubscriber()
export class TransactionEventSubscriber {
	private accountService: AccountService;

	constructor() {
		this.accountService = Container.get(AccountService);
	}

	@On(events.transaction.created)
	public async onTransactionCreate(transaction: Transaction): Promise<void> {
		await this.accountService.handleBalanceOnTransactionCreate(transaction);
	}

}
