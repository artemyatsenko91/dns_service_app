import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface IUserSchema extends Document {
    telegram_user_name: string;
}

const userSchema = new Schema({
    telegram_user_name: {
        type: String,
        required: true,
    },
});

const UserSchema = mongoose.model<IUserSchema>("telegram_user", userSchema);

export { UserSchema, IUserSchema };
