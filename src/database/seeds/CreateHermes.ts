import currency from "currency.js";
import {Connection} from 'typeorm';
import {Factory, Seeder} from 'typeorm-seeding';

import {User} from '../../../src/api/models/User';
import {Account} from "../../api/models/Account";
import {DailyInboundYield} from "../../api/models/DailyInboundYield";
import {Transaction, TransactionType} from "../../api/models/Transaction";

export class CreateHermes implements Seeder {

	public async run(factory: Factory, connection: Connection): Promise<any> {
		const initialDeposit = 500.0000;
		const firstDailyInboundYield = 5.5;
		const total = currency(initialDeposit, {precision: 4}).add(firstDailyInboundYield).value;

		const em = connection.createEntityManager();
		const account = new Account();
		account.balance = total;
		account.accountNumber = '68472358';
		const createdAccount = await em.save(account);

		const transaction = new Transaction();
		transaction.amount = initialDeposit;
		transaction.type = TransactionType.deposit;
		transaction.sourceAccountNumber = '68472358';
		transaction.targetAccountNumber = null;
		await em.save(transaction);


		const dailyInboundYield = new DailyInboundYield();
		dailyInboundYield.account = createdAccount;
		dailyInboundYield.amount = firstDailyInboundYield;
		await em.save(dailyInboundYield);

		const user = new User();
		user.name = 'Hermes Trismegisto';
		user.email = 'hermes.trismegisto@gmail.com';
		user.password = '12345678';
		user.account = createdAccount;
		return await em.save(user);
	}

}
