import {Connection} from 'typeorm';
import {Factory, Seeder} from 'typeorm-seeding';

import {User} from '../../../src/api/models/User';
import {Account} from "../../api/models/Account";
import {DailyInboundYield} from "../../api/models/DailyInboundYield";
import {Transaction, TransactionType} from "../../api/models/Transaction";

export class CreateMarciano implements Seeder {

    public async run(factory: Factory, connection: Connection): Promise<any> {
        const initialDeposit = 40.0001;
        const firstDailyInboundYield = 5.5;
        const total = initialDeposit + firstDailyInboundYield;

        const em = connection.createEntityManager();
        const account = new Account();
        account.balance = total;
        account.accountNumber = '12345678';
        const createdAccount = await em.save(account);

        const transaction = new Transaction();
        transaction.amount = initialDeposit;
        transaction.type = TransactionType.deposit;
        transaction.sourceAccountNumber = '12345678';
        transaction.targetAccountNumber = '12345678';
        await em.save(transaction);


        const dailyInboundYield = new DailyInboundYield();
        dailyInboundYield.account = createdAccount;
        dailyInboundYield.amount = firstDailyInboundYield;
        await em.save(dailyInboundYield);

        const user = new User();
        user.name = 'Charles Marciano';
        user.email = 'charles.marciano45@gmail.com';
        user.password = '12345678';
        user.account = createdAccount;
        return await em.save(user);
    }

}
