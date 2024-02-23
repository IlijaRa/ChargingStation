import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AccountsController } from "src/controllers";
import { User, UserSchema } from "src/schemas";
import { AccountsService, UsersService } from "src/services"

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserSchema
        }])
    ],
    providers: [AccountsService, UsersService],
    controllers: [AccountsController]
})
export class UsersModule {

}