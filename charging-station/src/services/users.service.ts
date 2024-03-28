import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserGetAllDto, UserGetAllItemDto, UserGetByIdDto, UserUpdateDto } from "src/dto";
import { User } from "src/schemas";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async update(model?: UserUpdateDto) {
        await this.userModel.findOneAndUpdate(
            {
                _id: model._id,
            }, 
            { 
                ...model 
            }
        );
    }

    async getById(userId: string): Promise<UserGetByIdDto | null> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            return null;
        }

        const userDto: UserGetByIdDto = {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: user.dateOfBirth,
            biography: user.biography,
            username: user.username,
            emailAddress: user.emailAddress,
            role: user.role,
            gender: user.gender,
            isBlocked: user.isBlocked,
            isConfirmed: user.isConfirmed
        };
    
        return userDto;
    }

    async getAll(): Promise<UserGetAllDto> {
        const users = await this.userModel.find();
        const userItems: UserGetAllItemDto[] = users.map(user => ({
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            biography: user.biography,
            username: user.username,
            gender: user.gender,
            isBlocked: user.isBlocked,
            isConfirmed: user.isConfirmed
        }));
        return { items: userItems };
    }

    getAllConfirmed() {
        return this.userModel.find({ isConfirmed: true });
    }

    getAllUnconfirmed() {
        return this.userModel.find({ isConfirmed: false });
    }

    getAllBlocked() {
        return this.userModel.find({ isBlocked: true });
    }

    getAllUnblocked() {
        return this.userModel.find({ isBlocked: false });
    }

    block(userId?: string) {
        return this.userModel.findByIdAndUpdate(userId, { isBlocked: true });
    }

    unblock(userId?: string) {
        return this.userModel.findByIdAndUpdate(userId, { isBlocked: false });
    }

    confirm(userId?: string) {
        return this.userModel.findByIdAndUpdate(userId, { isConfirmed: true });
    }
}