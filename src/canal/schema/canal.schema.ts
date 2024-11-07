import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Message } from "src/message/schema/message.schema";
import { User } from "src/users/schema/user.schema";


enum Type {
    Private,
    Public
}

@Schema()
export class Canal extends Document {
    @Prop({ type: String, required: true })
    name: string

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    members: User[]

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }] })
    messages: Message[]

    @Prop({ type: String, default: 'Public' })
    type: Type

    @Prop({ type: String })
    badWords: string[]
}
