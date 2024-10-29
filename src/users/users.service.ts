import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async register(createUserDto: Partial<User>): Promise<{ user: User; token: string }> {
        const saltRounds = 8;
        const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

        const user = new this.userModel({ ...createUserDto, password: hashedPassword });
        const savedUser = await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { email: savedUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { user: savedUser, token };
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOne(id: string): Promise<User> {
        return this.userModel.findById(id).exec();
    }

    async update(id: string, updateUserDto: Partial<User>): Promise<User> {
        return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    }

    async delete(id: string): Promise<User> {
        return this.userModel.findByIdAndDelete(id).exec();
    }
}
