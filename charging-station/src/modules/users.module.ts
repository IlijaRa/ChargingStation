import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AccountsController } from "src/controllers";
import { Charger, ChargerSchema, ChargingHistory, ChargingHistorySchema, User, UserSchema } from "src/schemas";
import { AccountsService, ChargingHistoriesService, UsersService } from "src/services"

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Charger.name, schema: ChargerSchema },
            { name: ChargingHistory.name, schema: ChargingHistorySchema },
            { name: User.name, schema: UserSchema }
        ])
    ],
    providers: [AccountsService, UsersService, ChargingHistoriesService],
    controllers: [AccountsController]
})
export class UsersModule {

}