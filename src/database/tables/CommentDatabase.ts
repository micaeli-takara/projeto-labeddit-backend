import { CommentBusiness } from "../../business/CommentBusiness";
import { CommentDB } from "../../models/Comments";
import { PostDB, PostWithCreatorDB } from "../../models/Posts";
import { BaseDatabase } from "../BaseDatabase";
import { PostDatabase } from "./PostDatabase";
import { UserDatabase } from "./UserDatabase";

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

    public async getComment(id: string)  {
        const result = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .select(
                `${CommentDatabase.TABLE_COMMENT}.id`,
                `${CommentDatabase.TABLE_COMMENT}.post_id`,
                `${CommentDatabase.TABLE_COMMENT}.content`,
                `${CommentDatabase.TABLE_COMMENT}.likes`,
                `${CommentDatabase.TABLE_COMMENT}.dislikes`,
                `${CommentDatabase.TABLE_COMMENT}.created_at`,
                `${CommentDatabase.TABLE_COMMENT}.updated_at`,
                `${CommentDatabase.TABLE_COMMENT}.creator_id`,
                `${UserDatabase.TABLE_USER}.name as creator_name`

            ).join(
                `${UserDatabase.TABLE_USER}`,
                `${CommentDatabase.TABLE_COMMENT}.creator_id`,
                "=",
                `${UserDatabase.TABLE_USER}.id`
            ).where({ post_id: id})

        return result
    }

    public async findComment(id: string): Promise<CommentDB | undefined> {
        const [commentDB]: CommentDB[] | undefined = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .where({ id: id })
        return commentDB
    }

    public async updateComment(commentDB: CommentDB): Promise<void> {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .update(commentDB)
            .where({ id: commentDB.id })
    }

    public async deleteComment(id: string): Promise<void> {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT_LIKES_DISLIKES)
            .delete()
            .where({ comments_id: id })

        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .delete()
            .where({ id: id })
    }
}
