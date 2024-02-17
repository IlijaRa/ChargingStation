import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://admin:admin@chargingstationsmongodb.gxgr2hi.mongodb.net/?retryWrites=true&w=majority'),
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
