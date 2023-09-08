import { COMMENT_LIKE, CommentDB, CommentWithCreatorDB, LikesDislikesCommentsDB } from "../../models/Comments";
import { PostWithCreatorDB } from "../../models/Posts";
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
            ).where({
                post_id: id
            }).orderBy(
                "likes", "desc"
            )

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

    public async likeOrDislikeComment(likeDislikeCommentsDB: LikesDislikesCommentsDB): Promise<void> {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT_LIKES_DISLIKES)
            .insert(likeDislikeCommentsDB)
    }

    public async findLikeDislike(likeDislikeCommentsDB: LikesDislikesCommentsDB): Promise<COMMENT_LIKE | undefined> {
        const [result]: Array<LikesDislikesCommentsDB | undefined> = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT_LIKES_DISLIKES)
            .select()
            .where({
                user_id: likeDislikeCommentsDB.user_id,
                comments_id: likeDislikeCommentsDB.comments_id
            })

        if (result === undefined) {
            return undefined
        } else if (result.like === 1) {
            return COMMENT_LIKE.ON_LIKED
        } else {
            return COMMENT_LIKE.ON_DISLIKED
        }
    }

    public async removeLikeDislike(likeDislikeCommentsDB: LikesDislikesCommentsDB): Promise<void> {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT_LIKES_DISLIKES)
            .delete()
            .where({
                user_id: likeDislikeCommentsDB.user_id,
                comments_id: likeDislikeCommentsDB.comments_id
            })
    }

    public async updateLikeDislike(likeDislikeCommentsDB: LikesDislikesCommentsDB): Promise<void> {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT_LIKES_DISLIKES)
            .update(likeDislikeCommentsDB)
            .where({
                user_id: likeDislikeCommentsDB.user_id,
                comments_id: likeDislikeCommentsDB.comments_id
            })
    }
}
