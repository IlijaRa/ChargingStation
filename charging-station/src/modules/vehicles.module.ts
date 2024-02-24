import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VehiclesController } from "src/controllers";
import { Vehicle, VehicleSchema } from "src/schemas";
import { VehiclesService } from "src/services";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Vehicle.name,
            schema: VehicleSchema
        }])
    ],
    providers: [VehiclesService],
    controllers: [VehiclesController]
})
export class VehiclesModule {

}