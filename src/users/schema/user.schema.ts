import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Schema as MongooseSchema} from 'mongoose';

export type UserDocument = HydratedDocument<User>;

type Role = 'admin' | 'user' | 'business';

@Schema({timestamps: true})
export class User {
    @Prop({type: MongooseSchema.Types.ObjectId, auto: true})
    _id: MongooseSchema.Types.ObjectId;

    @Prop({required: true})
    username: string;

    @Prop({required: true})
    phone: string;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop({default: 'user', enum: ['admin', 'user']})
    role: Role;

    @Prop({type: String, default: null})
    refreshToken: string | null;

    @Prop({type: String, default: null})
    otp_key: string | null;

    @Prop({ type: String, default: null })
    emailVerificationToken: string | null;

    @Prop({ type: Boolean, default: false })
    isEmailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
