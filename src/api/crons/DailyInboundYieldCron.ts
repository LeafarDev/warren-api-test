import {CronJob} from "cron";
import logger from "node-color-log";
import {Container} from "typeorm-typedi-extensions";
import {DailyInboundYieldService} from "../services/DailyInboundYieldService";

export class DailyInboundYieldCron {
	cronJob: CronJob;

	execute() {
		this.cronJob = new CronJob('0 0 * * *', async () => {
			try {
				const dailyInboundYieldService = Container.get(DailyInboundYieldService);
				dailyInboundYieldService.handleDailyInboundYieldCron();
			} catch (e) {
				logger.fontColorLog('red', e);
			}
		});

		if (!this.cronJob.running) {
			this.cronJob.start();
		}
	}
}
