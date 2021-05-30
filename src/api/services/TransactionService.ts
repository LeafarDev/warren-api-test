import currency from "currency.js";
import logger from "node-color-log";
import {HttpError} from "routing-controllers";
import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions";
import {EventDispatcher, EventDispatcherInterface} from "../../decorators/EventDispatcher";
import {AccountDestinationAndSourceAreEqual} from "../errors/AccountDestinationAndSourceAreEqual";
import {AccountDestinationNotFound} from "../errors/AccountDestinationNotFound";
import {CantCreateTransaction} from "../errors/CantCreateTransaction";
import {CantGetTransactionList} from "../errors/CantGetTransactionList";
import {InsufficientFunds} from "../errors/InsufficientFunds";
import {TransactionAccountDestinationNeeded} from "../errors/TransactionAccountDestinationNeeded";
import {TransactionSourceAccountIsIncorrect} from "../errors/TransactionSourceAccountIsIncorrect";
import {Transaction, TransactionType} from "../models/Transaction";
import {AccountRepository} from "../repositories/AccountRepository";
import {TransactionRepository} from "../repositories/TransactionRepository";
import {UserRepository} from "../repositories/UserRepository";
import {events} from "../subscribers/events";

@Service()
export class TransactionService {

	constructor(@InjectRepository() private transactionRepository: TransactionRepository,
		@InjectRepository() private userRepository: UserRepository,
		@EventDispatcher() private eventDispatcher: EventDispatcherInterface,
		@InjectRepository() private accountRepository: AccountRepository) {
	}

	public async findByUserId(userId: string): Promise<Transaction[]> {
		try {
			const user = await this.userRepository.findOne({id: userId}, {relations: ['account']});
			return this.transactionRepository.find({
				where: {
					sourceAccountNumber: user.account.accountNumber
				}
			});
		} catch (error) {
			logger.fontColorLog('red', error.message);
			throw new CantGetTransactionList;
		}
	}

	public async create(transaction: Transaction, userId: string): Promise<Transaction> {
		try {
			const user = await this.userRepository.findOne({id: userId}, {relations: ['account']});
			if (transaction.sourceAccountNumber !== user.account.accountNumber) {
				throw new TransactionSourceAccountIsIncorrect;
			}

			if (transaction.type === TransactionType.payment) {

				if (!transaction.targetAccountNumber) {
					throw new TransactionAccountDestinationNeeded;
				}

				if (transaction.targetAccountNumber === transaction.sourceAccountNumber) {
					throw new AccountDestinationAndSourceAreEqual;
				}

				const targetAccount = this.accountRepository.findOne({
					where: {
						accountNumber: transaction.targetAccountNumber
					}
				});

				if (!targetAccount) {
					throw new AccountDestinationNotFound;
				}
			} else {
				transaction.targetAccountNumber = null;
			}

			if (transaction.type === TransactionType.payment || transaction.type === TransactionType.withdraw) {
				if (currency(user.account.balance, {precision: 4}).subtract(transaction.amount).value < 0) {
					throw new InsufficientFunds;
				}
			}

			const createdTransaction = await this.transactionRepository.save(transaction);

			if (createdTransaction) {
				this.eventDispatcher.dispatch(events.transaction.created, createdTransaction);
			}
			return createdTransaction;
		} catch (error) {

			if (error.constructor === HttpError) {
				throw error;
			}
			logger.fontColorLog('red', error.message);
			throw new CantCreateTransaction;
		}
	}
}
