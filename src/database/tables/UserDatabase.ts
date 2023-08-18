import { UserDB } from "../../models/Users";
import { BaseDatabase } from "../BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USER = "users"

    public insertUser = async (userDB: UserDB): Promise<void> => {
        await BaseDatabase
            .connection(UserDatabase.TABLE_USER)
            .insert(userDB)
    }

    public findUserByEmail = async (email: string): Promise<UserDB | undefined> => {
        const [userDB]: Array<UserDB | undefined> = await BaseDatabase.connection(UserDatabase.TABLE_USER)
            .select()
            .where({ email })
            
        return userDB
    }
}