import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/schema/user.schema';
import { error } from 'console';
import tokenBlacklist from '../../token/tokenBlacklist';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }
    async register(createUserDto: Partial<User>): Promise<{ user: User }> {
        try {

            const user = new this.userModel({ ...createUserDto });
            const savedUser = await user.save();

            return { user: savedUser };
        } catch (error) {
            if (error.code === 11000) {
                throw new BadRequestException('Email already exists');
            }
            throw error;
        }

    }


    async login(email: string): Promise<{ user: User }> {
        const user = await this.userModel.findOne({ email })
        if (!user) {
            throw new error('Email not found!')
        }
        return { user };
    }
}
