import { IUserSchema, UserSchema } from "../../models/users";

export const getDataFromDB = async (
    userName: string,
): Promise<IUserSchema | null> => {
    try {
        const data = await UserSchema.findOne({ telegram_user_name: userName });

        if (!data) {
            return null;
        }
        return data;
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        return null;
    }
};

export const createNewUser = async (userName: string) => {
    const result = await UserSchema.create({ telegram_user_name: userName });

    return result;
};
