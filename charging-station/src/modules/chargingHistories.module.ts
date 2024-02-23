import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChargingHistory, ChargingHistorySchema } from "src/schemas";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: ChargingHistory.name,
            schema: ChargingHistorySchema
        }])
    ]
})
export class ChargingHistoriesModule {

}