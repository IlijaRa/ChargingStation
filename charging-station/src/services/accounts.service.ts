import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CurrentUserGetDto } from "src/dto";
import { User } from "src/schemas";

@Injectable()
export class AccountsService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async getCurrentUser(userId?: string): Promise<CurrentUserGetDto> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            return null;
        }

        const userDto: CurrentUserGetDto = {
            firstName: user.firstName,
            lastName: user.lastName,
            roles: [user.role]
        };
    
        return userDto;
    }

    async checkCredentials(usernameOrEmail?: string): Promise<boolean> {
        const user = await this.userModel.findOne({ 
            $or: [ 
                { 
                    username: usernameOrEmail 
                }, 
                { 
                    email: usernameOrEmail 
                } 
            ] 
        });
        
        if (user) {
            return true;
        } else {
            throw new ForbiddenException('User with given credentials already exists (username or email)');
        }
    }
}