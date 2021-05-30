import {Authorized, Body, Get, JsonController, Post, Req, UseBefore} from "routing-controllers";
import {Container} from "typeorm-typedi-extensions";
import {UserIdWrapper} from "../middlewares/UserIdWrapper";
import {Transaction} from "../models/Transaction";
import {TransactionService} from "../services/TransactionService";

@Authorized()
@JsonController('/transactions')
export class TransactionController {
	private transactionService: TransactionService;

	constructor() {
		this.transactionService = Container.get(TransactionService);
	}

	@Get()
	@UseBefore(UserIdWrapper)
	public find(@Req() req: any): Promise<Transaction[]> {
		const {userId} = req;
		return this.transactionService.findByUserId(userId);
	}

	@Post()
	@UseBefore(UserIdWrapper)
	public create(@Body({required: true}) body: Transaction, @Req() req: any): Promise<Transaction> {
		const {userId} = req;
		return this.transactionService.create(body, userId);
	}
}
