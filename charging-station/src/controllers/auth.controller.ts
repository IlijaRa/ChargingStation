import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { GetCurrentUser, GetCurrentUserId, Public, RefreshTokenGuard } from "src/common";
import { LoginDto, RegistrationDto } from "src/dto";
import { AuthService } from "src/services";
import { Tokens } from "src/types";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() model: RegistrationDto): Promise<Tokens> {
        return this.authService.register(model);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() model: LoginDto): Promise<Tokens> {
        return this.authService.login(model);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserId() userId: string) {
        this.authService.logout(userId);
    }

    @Public()
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@GetCurrentUserId() userId: string, @GetCurrentUser('refreshToken') refreshToken: string) {
        return this.authService.refreshTokens(userId, refreshToken);
    }
}