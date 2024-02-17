import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Vehicle, VehicleSchema } from "src";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Vehicle.name,
            schema: VehicleSchema
        }])
    ]
})
export class VehiclesModule {

}