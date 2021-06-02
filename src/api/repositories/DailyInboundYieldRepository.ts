import currency from "currency.js";
import {EntityRepository, Repository} from "typeorm";
import {DailyInboundYield} from "../models/DailyInboundYield";
import {UserTotalInboundYield} from "../types/UserTotalInboundYield";

@EntityRepository(DailyInboundYield)
export class DailyInboundYieldRepository extends Repository<DailyInboundYield> {

	async getAccountTotalInboundYield(accountId: string): Promise<UserTotalInboundYield> {
		const {sum} = await this.createQueryBuilder("daily_inbound_yields")
			.select("SUM(daily_inbound_yields.amount)", "sum")
			.where("daily_inbound_yields.account_id = :id", {id: accountId})
			.getRawOne();
		return {total: currency(sum, {precision: 4}).value};
	}
}
