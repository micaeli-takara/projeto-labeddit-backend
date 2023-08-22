import { CommentDB, CommentWithCreatorDB, LikesDislikesCommentsDB } from "../../models/Comments";
import {  PostWithCreatorDB } from "../../models/Posts";
import { BaseDatabase } from "../BaseDatabase";
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

    public async getComment(id: string) {
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
            ).where({ post_id: id })

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

    public async findCommentWithCreatorId(id: string): Promise<CommentWithCreatorDB | undefined> {
        const [result] = await BaseDatabase
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
            )
            .join(
                `${UserDatabase.TABLE_USER}`,
                `${CommentDatabase.TABLE_COMMENT}.creator_id`,
                "=",
                `${UserDatabase.TABLE_USER}.id`)
            .where({ [`${CommentDatabase.TABLE_COMMENT}.id`]: id })

        return result as CommentWithCreatorDB | undefined
    }

    public async likeOrDislikeComment(likeDislike: LikesDislikesCommentsDB): Promise<void> {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENT_LIKES_DISLIKES)
            .insert(likeDislike)
    }

    public async findLikeDislike(likeDislike: LikesDislikesCommentsDB) {
        const [likeDislikeDB]: LikesDislikesCommentsDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT_LIKES_DISLIKES)
            .select()
            .where({
                user_id: likeDislike.user_id,
                comments_id: likeDislike.comments_id
            })
        if (likeDislikeDB) {
            return likeDislikeDB.like === 1 ? "already liked" : "already disliked"
        } else {
            return null
        }
    }

    public async removeLikeDislike(likeDislike: LikesDislikesCommentsDB): Promise<void> {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENT_LIKES_DISLIKES)
            .delete()
            .where({
                user_id: likeDislike.user_id,
                comments_id: likeDislike.comments_id
            })
    }

    public async updateLikeDislike(likeDislike: LikesDislikesCommentsDB): Promise<void> {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENT_LIKES_DISLIKES)
            .update(likeDislike)
            .where({
                user_id: likeDislike.user_id,
                comments_id: likeDislike.comments_id
            })
    }
}
