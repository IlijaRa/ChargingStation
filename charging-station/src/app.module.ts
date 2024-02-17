import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsModule, ChargersModule, ChargingHistoriesModule, UsersModule, VehiclesModule } from 'src';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://admin:admin@chargingstationsmongodb.gxgr2hi.mongodb.net/?retryWrites=true&w=majority'),
    AppointmentsModule,
    ChargersModule,
    ChargingHistoriesModule,
    UsersModule,
    VehiclesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
