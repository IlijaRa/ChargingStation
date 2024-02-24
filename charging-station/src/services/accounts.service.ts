import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RegistrationDto } from "src/dto";
import { User } from "src/schemas";

@Injectable()
export class AccountsService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    register(model?: RegistrationDto) {
        return new this.userModel(model).save();
    }
}