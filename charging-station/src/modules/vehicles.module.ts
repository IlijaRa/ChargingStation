import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VehiclesController } from "src/controllers";
import { User, UserSchema, Vehicle, VehicleSchema } from "src/schemas";
import { VehiclesService } from "src/services";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Vehicle.name, schema: VehicleSchema },
            { name: User.name, schema: UserSchema }
        ])
    ],
    providers: [VehiclesService],
    controllers: [VehiclesController]
})
export class VehiclesModule { }