import { CommentDB } from "../../models/Comments";
import { PostDB, PostWithCreatorDB } from "../../models/Posts";
import { BaseDatabase } from "../BaseDatabase";
import { PostDatabase } from "./PostDatabase";

export class CommentDatabase extends BaseDatabase { 
    public static TABLE_COMMENT = "comments"
    public static TABLE_COMMENT_LIKES_DISLIKES = "comment_likes_dislikes"
    public static TABLE_POST = "posts"

    public async insertComment(post: CommentDB): Promise<void> {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .insert(post)
    }

    public async findPost(id: string): Promise<PostWithCreatorDB | undefined> {
        const [postDB]: PostWithCreatorDB[] | undefined = await BaseDatabase
            .connection(CommentDatabase.TABLE_POST)
            .where({ id: id })
        return postDB
    }

    public async updatePost(postDB: PostDB): Promise<void> {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .update(postDB)
            .where({ id: postDB.id })
    }
}
