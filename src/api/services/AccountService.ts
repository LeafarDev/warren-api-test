import currency from 'currency.js';
import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions";
import {Transaction, TransactionType} from "../models/Transaction";
import {AccountRepository} from "../repositories/AccountRepository";

@Service()
export class AccountService {
	constructor(@InjectRepository() private accountRepository: AccountRepository) {
	}

	private async increaseBalance(AccountNumber: string, amount: number): Promise<void> {
		const account = await this.accountRepository.findOne({
			where: {
				accountNumber: AccountNumber
			}
		});
		account.balance = currency(account.balance, {precision: 4}).add(amount).value;
		await this.accountRepository.save(account);
	}

	private async decreaseBalance(AccountNumber: string, amount: number): Promise<void> {
		const account = await this.accountRepository.findOne({
			where: {
				accountNumber: AccountNumber
			}
		});
		account.balance = currency(account.balance, {precision: 4}).subtract(amount).value;
		await this.accountRepository.save(account);
	}

	public async handleBalanceOnTransactionCreate(transaction: Transaction): Promise<void> {
		if (transaction.type === TransactionType.payment) {
			await this.increaseBalance(transaction.targetAccountNumber, transaction.amount);
			await this.decreaseBalance(transaction.sourceAccountNumber, transaction.amount);
		}
		if (transaction.type === TransactionType.deposit) {
			await this.increaseBalance(transaction.sourceAccountNumber, transaction.amount);
		}
		if (transaction.type === TransactionType.withdraw) {
			await this.decreaseBalance(transaction.sourceAccountNumber, transaction.amount);
		}
	}

}
