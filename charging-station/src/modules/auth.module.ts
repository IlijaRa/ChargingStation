import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthController } from "src/controllers";
import { User, UserSchema } from "src/schemas";
import { AuthService } from "src/services";
import { AccessTokenStrategy, RefreshTokenStrategy } from "src/strategies";

@Module({
    imports: [
        JwtModule.register({}),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema }
        ])
    ],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
    controllers: [AuthController]
})
export class AuthModule {

}