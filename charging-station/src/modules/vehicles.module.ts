import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Vehicle, VehicleSchema } from "src/schemas";

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