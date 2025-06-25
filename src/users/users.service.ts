import {Injectable} from '@nestjs/common';
import {User, UserDocument} from './schema/user.schema';
import {Model, Promise} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import {UserDTO} from './dto/user';
import {AuthServiceInterface} from "../auth/AuthServiceInterface";
import {UpdateUserProfileDTO} from "./dto/updateUserProfile.dto";

@Injectable()
export class UsersService implements AuthServiceInterface {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
    }

    async findByID(id: string): Promise<User | null> {
        const user = await this.userModel.findById(id).exec(); // 👈 use findById
        return user ?? null;
    }

    async findOne(email: string): Promise<User | null> {
        return await this.userModel.findOne({email}) ?? null;
    }

    async create(user: UserDTO): Promise<User> {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = new this.userModel({...user, password: hashedPassword, refreshToken: null});
        return await newUser.save();
    }

    async findAll(page: number = 1, limit: number = 10): Promise<{
        data: User[];
        page: number;
        total: number;
        totalPages: number;
    }> {
        const skip = (page - 1) * limit;
        const total = await this.userModel.countDocuments();
        const data = await this.userModel.find().skip(skip).limit(limit).exec();
        return {
            data,
            page,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }


    async deleteAll(): Promise<void> {
        await this.userModel.deleteMany();
    }

    async updateRefreshToken(email: string, refreshToken: string): Promise<User | null> {
        const user = await this.userModel.findOne({email});
        if (!user) return null;
        user.refreshToken = refreshToken;
        await user.save();
        return user;
    }

    async updatePassword(email: string, password: string): Promise<User | null> {
        const user = await this.userModel.findOne({email});
        if (!user) return null;
        user.password = await bcrypt.hash(password, 10);
        return user;
    }

    async logout(email: string) {
        const user = await this.userModel.findOne({email});
        if (!user) return null;
        user.refreshToken = null;
        return true;
    }

    async editProfile(id: string, data: UpdateUserProfileDTO): Promise<User | null> {
        return await this.userModel.findByIdAndUpdate(
            id,
            {$set: data},
            {new: true}
        ).exec();
    }
}
