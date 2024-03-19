import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AccountsController, UsersController } from "src/controllers";
import { Charger, ChargerSchema, ChargingHistory, ChargingHistorySchema, User, UserSchema } from "src/schemas";
import { AccountsService, ChargingHistoriesService, UsersService } from "src/services"
import { AccessTokenStrategy, RefreshTokenStrategy } from "src/strategies";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Charger.name, schema: ChargerSchema },
            { name: ChargingHistory.name, schema: ChargingHistorySchema },
            { name: User.name, schema: UserSchema }
        ])
    ],
    providers: [AccountsService, UsersService, ChargingHistoriesService],
    controllers: [AccountsController, UsersController]
})
export class UsersModule {

}