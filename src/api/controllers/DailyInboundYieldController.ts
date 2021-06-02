import {Authorized, Get, JsonController, Req, UseBefore} from "routing-controllers";
import {Container} from "typeorm-typedi-extensions";
import {UserIdWrapper} from "../middlewares/UserIdWrapper";
import {DailyInboundYieldService} from "../services/DailyInboundYieldService";
import {UserTotalInboundYield} from "../types/UserTotalInboundYield";

@Authorized()
@JsonController('/inbounds/yields')
export class DailyInboundYieldController {
	private dailyInboundYieldService: DailyInboundYieldService;

	constructor() {
		this.dailyInboundYieldService = Container.get(DailyInboundYieldService);
	}

	@Get('/total')
	@UseBefore(UserIdWrapper)
	public find(@Req() req: any): Promise<UserTotalInboundYield> {
		const {userId} = req;
		return this.dailyInboundYieldService.getAccountTotalInboundYield(userId);
	}
}
