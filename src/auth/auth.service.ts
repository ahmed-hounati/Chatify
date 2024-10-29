import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/schema/user.schema';
import { error } from 'console';
import tokenBlacklist from '../../token/tokenBlacklist';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }
    async register(createUserDto: Partial<User>): Promise<{ user: User; token: string }> {
        try {
            const hashedPassword = await bcrypt.hash(createUserDto.password, 8);

            const user = new this.userModel({ ...createUserDto, password: hashedPassword });
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


    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        const user = await this.userModel.findOne({ email })
        if (!user) {
            throw new error('Email not found!')
        }
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            throw new error('Password incorrect')
        }

        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { user, token };
    }

    async logout(authHeader: string) {
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header missing');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }
        try {
            tokenBlacklist.add(token);
            return { message: 'Logout successfully' }
        } catch (error) {
            throw error;
        }
    }
}
