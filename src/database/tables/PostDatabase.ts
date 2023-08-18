import { PostDB } from "../../models/Posts";
import { BaseDatabase } from "../BaseDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POST = "posts"
    public static TABLE_POST_LIKES_DISLIKES = "post_likes_dislikes"

    public insertPost = async (postDB: PostDB): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .insert(postDB)
    }
}