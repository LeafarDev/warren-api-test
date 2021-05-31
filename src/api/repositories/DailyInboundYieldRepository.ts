import {EntityRepository, Repository} from "typeorm";
import {DailyInboundYield} from "../models/DailyInboundYield";

@EntityRepository(DailyInboundYield)
export class DailyInboundYieldRepository extends Repository<DailyInboundYield> {

}
