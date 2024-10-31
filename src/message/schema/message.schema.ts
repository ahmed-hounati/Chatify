import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User } from "src/users/schema/user.schema";

enum Status {
    seen,
    sent
}

@Schema()
export class Message extends Document {
    @Prop({ required: true })
    text: string;

    @Prop({ required: true, type: [{ type: Types.ObjectId, ref: 'User' }] })
    from: User;

    @Prop({ required: true, type: [{ type: Types.ObjectId, ref: 'User' }] })
    to: User;

    @Prop({ type: String, enum: Status })
    status: Status

    @Prop({ default: false })
    isPinned: boolean
}