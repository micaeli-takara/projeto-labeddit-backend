import { PostDB, PostDBWithCreatorName } from "../../models/Posts";
import { BaseDatabase } from "../BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POST = "posts"
    public static TABLE_POST_LIKES_DISLIKES = "post_likes_dislikes"

    public insertPost = async (postDB: PostDB): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .insert(postDB)
    }

    public getPostsWithCreatorsName = async (): Promise<PostDBWithCreatorName[]> => {
        const result: PostDBWithCreatorName[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .select(
                `${PostDatabase.TABLE_POST}.id`,
                `${PostDatabase.TABLE_POST}.creator_id`,
                `${PostDatabase.TABLE_POST}.content`,
                `${PostDatabase.TABLE_POST}.likes`,
                `${PostDatabase.TABLE_POST}.dislikes`,
                `${PostDatabase.TABLE_POST}.created_at`,
                `${PostDatabase.TABLE_POST}.updated_at`,
                `${UserDatabase.TABLE_USER}.name as creator_name`
            )
            .join(
                `${UserDatabase.TABLE_USER}`,
                `${PostDatabase.TABLE_POST}.creator_id`,
                "=",
                `${UserDatabase.TABLE_USER}.id`
            )

        return result
    }

    public findPostById = async (id: string): Promise<PostDB | undefined> => {
        const [result] = await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .select()
            .where({ id })

        return result as PostDB | undefined
    }
}