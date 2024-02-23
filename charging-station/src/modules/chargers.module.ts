import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Charger, ChargerSchema } from "src/schemas";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Charger.name,
            schema: ChargerSchema
        }])
    ]
})
export class ChargersModule {

}