import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsModule, AuthModule, ChargersModule, ChargingHistoriesModule, ScheduleChargersModule, UsersModule, VehiclesModule } from 'src';
import { AccessTokenGuard } from './common';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://admin:admin@chargingstationsmongodb.gxgr2hi.mongodb.net/?retryWrites=true&w=majority'),
    AppointmentsModule,
    AuthModule,
    ChargersModule,
    ChargingHistoriesModule,
    UsersModule,
    VehiclesModule,
    ScheduleChargersModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard
    }
  ],
})
export class AppModule {}
