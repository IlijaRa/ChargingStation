import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChargersController } from "src/controllers";
import { Charger, ChargerSchema } from "src/schemas";
import { ChargersService } from "src/services";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Charger.name,
            schema: ChargerSchema
        }])
    ],
    providers: [ChargersService],
    controllers: [ChargersController]
})
export class ChargersModule {

}