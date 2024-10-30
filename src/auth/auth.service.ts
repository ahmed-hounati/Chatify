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
    async register(createUserDto: Partial<User>): Promise<{ user: User; token: string }> {
        try {

            const user = new this.userModel({ ...createUserDto });
            const savedUser = await user.save();

            const token = jwt.sign(
                { email: savedUser.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return { user: savedUser, token };
        } catch (error) {
            if (error.code === 11000) {
                throw new BadRequestException('Email already exists');
            }
            throw error;
        }

    }


    async login(email: string): Promise<{ user: User; token: string }> {
        const user = await this.userModel.findOne({ email })
        if (!user) {
            throw new error('Email not found!')
        }

        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { user, token };
    }

    async validateToken(authHeader: string): Promise<void> {
        const token = authHeader.split(' ')[1];
        if (!token || tokenBlacklist.has(token)) {
            throw new UnauthorizedException('Invalid or blacklisted token');
        }
        try {
            jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    async logout(authHeader: string): Promise<{ message: string }> {
        await this.validateToken(authHeader);
        const token = authHeader.split(' ')[1];
        tokenBlacklist.add(token);
        return { message: 'Logout successfully' };
    }
}
