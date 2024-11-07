import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEnum } from "class-validator";
import { Document, Types } from "mongoose";
import { User } from "src/users/schema/user.schema";

enum Status {
    accepted,
    waiting
}

@Schema()
export class Request extends Document {
    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    from: User;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    to: User;

    @Prop({ type: String, enum: Status })
    @IsEnum(Status)
    status: Status
}

export const RequestSchema = SchemaFactory.createForClass(Request);