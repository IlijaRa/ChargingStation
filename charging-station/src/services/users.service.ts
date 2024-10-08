import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserAllDto, UserAllItemDto, UserGetAllDto, UserGetAllItemDto, UserGetByIdDto, UserSearchDto, UserSearchItemDto, UserUpdateDto } from "src/dto";
import { User } from "src/schemas";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async update(model?: UserUpdateDto) {
        const user = await this.userModel.findById(model._id);
        
        if (!user) {
            throw new HttpException('User with provided id does not exist.', HttpStatus.BAD_REQUEST);
        }

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
            throw new HttpException('User with provided id does not exist.', HttpStatus.BAD_REQUEST);
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
            gender: user.gender
        };
    
        return userDto;
    }

    async getAll(): Promise<UserGetAllDto> {
        const users = await this.userModel.find({ role: 'driver' });
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

    async all(): Promise<UserAllDto> {
        const users = await this.userModel.find({ isBlocked: false, isConfirmed: true, role: 'driver' });
        const userItems: UserAllItemDto[] = users.map(user => ({
            id: user._id.toString(),
            fullName: `${user.firstName} ${user.lastName}`,
        }));
        return { items: userItems };
    }

    async getAllConfirmed(): Promise<UserGetAllDto> {
        const users = await this.userModel.find({ isConfirmed: true, role: 'driver' });
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

    async searchConfirmed(query?: string): Promise<UserSearchDto> {
        let confirmedUsers;

        if (this.isEmpty(query)) {
            confirmedUsers = await this.userModel.find({ isConfirmed: true, role: 'driver' });
        } else {
            const searchCriteria = {
                $and: [
                    { isConfirmed: true },
                    {
                        $or: [
                            { firstName: new RegExp(query, 'i') },
                            { lastName: new RegExp(query, 'i') },
                            { biography: new RegExp(query, 'i') },
                            { username: new RegExp(query, 'i') },
                            { gender: new RegExp(query, 'i') },
                            { biography: new RegExp(query, 'i') }
                        ]
                    }
                ]
            };
    
            confirmedUsers = await this.userModel.find(searchCriteria);
        }

        const confirmedUserItems: UserSearchItemDto[] = confirmedUsers.map(user => ({
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            biography: user.biography,
            username: user.username,
            gender: user.gender,
            isBlocked: user.isBlocked,
            isConfirmed: user.isConfirmed
        }));

        return { items: confirmedUserItems };
    }

    async getAllUnconfirmed(): Promise<UserGetAllDto> {
        const users = await this.userModel.find({ isConfirmed: false, role: 'driver' });
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

    async searchUnconfirmed(query?: string): Promise<UserSearchDto> {
        let unconfirmedUsers;

        if (this.isEmpty(query)) {
            unconfirmedUsers = await this.userModel.find({ isConfirmed: false, role: 'driver' });
        } else {
            const searchCriteria = {
                $and: [
                    { isConfirmed: false },
                    {
                        $or: [
                            { firstName: new RegExp(query, 'i') },
                            { lastName: new RegExp(query, 'i') },
                            { biography: new RegExp(query, 'i') },
                            { username: new RegExp(query, 'i') },
                            { gender: new RegExp(query, 'i') },
                            { biography: new RegExp(query, 'i') }
                        ]
                    }
                ]
            };
    
            unconfirmedUsers = await this.userModel.find(searchCriteria);
        }

        const unconfirmedUserItems: UserSearchItemDto[] = unconfirmedUsers.map(user => ({
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            biography: user.biography,
            username: user.username,
            gender: user.gender,
            isBlocked: user.isBlocked,
            isConfirmed: user.isConfirmed
        }));

        return { items: unconfirmedUserItems };
    }

    getAllBlocked() {
        return this.userModel.find({ isBlocked: true, role: 'driver' });
    }

    getAllUnblocked() {
        return this.userModel.find({ isBlocked: false, role: 'driver' });
    }

    async block(userId?: string) {
        const user = await this.userModel.findById(userId);
        
        if (!user) {
            throw new HttpException('User with provided id does not exist.', HttpStatus.BAD_REQUEST);
        }

        return this.userModel.findByIdAndUpdate(userId, { isBlocked: true });
    }

    async unblock(userId?: string) {
        const user = await this.userModel.findById(userId);
        
        if (!user) {
            throw new HttpException('User with provided id does not exist.', HttpStatus.BAD_REQUEST);
        }

        return this.userModel.findByIdAndUpdate(userId, { isBlocked: false });
    }

    async confirm(userId?: string) {
        const user = await this.userModel.findById(userId);
        
        if (!user) {
            throw new HttpException('User with provided id does not exist.', HttpStatus.BAD_REQUEST);
        }

        return this.userModel.findByIdAndUpdate(userId, { isConfirmed: true });
    }

    async delete(userId?: string) {
        const user = await this.userModel.findById(userId);
        
        if (!user) {
            throw new HttpException('User with provided id does not exist.', HttpStatus.BAD_REQUEST);
        }

        return this.userModel.findByIdAndDelete(userId);
    }

    //#region Helpers

    private isEmpty(value) {
        return (value == null || (typeof value === "string" && value.trim().length === 0));
    }

    //#endregion
}