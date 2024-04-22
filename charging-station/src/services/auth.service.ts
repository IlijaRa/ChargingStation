import { ForbiddenException, HttpCode, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoginDto, RegistrationDto } from "src/dto";
import { User } from "src/schemas";
import * as bcrypt from 'bcrypt';
import { Tokens } from "src/types";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, 
                private jwtService: JwtService) {}
    
    async register(model?: RegistrationDto): Promise<Tokens> {
        const newUser = await new this.userModel({ 
                ...model, 
                password: await this.hashData(model.password) 
            }).save();

        const tokens = await this.generateTokens(newUser.id, newUser.username, newUser.emailAddress);
        
        await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);

        return tokens;
    }
    
    async login(model?: LoginDto): Promise<Tokens> {
        const user = await this.userModel.findOne({ 
            $or: [ 
                { 
                    username: model.usernameOrEmail 
                }, 
                { 
                    email: model.usernameOrEmail 
                } 
            ] 
        });

        if (!user) {
            throw new HttpException('Account with this username/email does not exist.', HttpStatus.BAD_REQUEST);
        }

        if (user.isConfirmed == false) {
            throw new HttpException('Your account is not confirmed yet.', HttpStatus.BAD_REQUEST);
        }

        const passwordMatch = await bcrypt.compare(model.password, user.password);

        if (!passwordMatch) {
            throw new HttpException('Password is not correct.', HttpStatus.BAD_REQUEST);
        }

        const tokens = await this.generateTokens(user.id, user.username, user.emailAddress);
        
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async logout(userId?: string) {
        await this.userModel.findOneAndUpdate( 
            { 
                _id: userId, 
                refreshTokenHash: { $ne: null } 
            }, 
            { 
                refreshTokenHash: null 
            } 
        );
    }

    async refreshTokens(userId?: string, refreshToken?: string) {
        const user = await this.userModel.findById(userId)
        
        if (!user || !user.refreshTokenHash) {
            throw new ForbiddenException('Access Denied');
        }

        const refreshTokensMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        
        if (!refreshTokensMatch) {
            throw new ForbiddenException('Access Denied');
        }
        
        const tokens = await this.generateTokens(user.id, user.username, user.emailAddress);
        
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async updateRefreshTokenHash(userId?: string, regreshToken?: string) {
        const hash = await this.hashData(regreshToken);
        await this.userModel.findByIdAndUpdate(userId, { refreshTokenHash: hash });
    }

    //#region Helpers

    async generateTokens(userId?: string, username?: string, emailAddress?: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                { 
                    sub: userId, 
                    username, 
                    emailAddress 
                }, 
                { 
                    secret: 'om98ZJ0tf0PZrcA', 
                    expiresIn: 60 * 15 /* 15 minutes */
                } 
            ),
            this.jwtService.signAsync(
                { 
                    sub: userId, 
                    username, 
                    emailAddress 
                },
                { 
                    secret: 'oKOdXWrJrb5eaeT', 
                    expiresIn: 60 * 60 * 24 * 7 /* 7 days */
                }
            )
        ])

        return {
            access_token: at,
            refresh_token: rt
        };
    }

    async hashData(data?: string) {
        return await bcrypt.hash(data, 10);
    }

    //#endregion
}