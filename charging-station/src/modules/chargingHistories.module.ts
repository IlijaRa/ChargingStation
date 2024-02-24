import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChargingHistoriesController } from "src/controllers";
import { Charger, ChargerSchema, ChargingHistory, ChargingHistorySchema, User, UserSchema } from "src/schemas";
import { ChargingHistoriesService } from "src/services";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Charger.name, schema: ChargerSchema },
            { name: ChargingHistory.name, schema: ChargingHistorySchema },
            { name: User.name, schema: UserSchema }
        ])
    ],
    providers: [ChargingHistoriesService],
    controllers: [ChargingHistoriesController]
})
export class ChargingHistoriesModule {

}