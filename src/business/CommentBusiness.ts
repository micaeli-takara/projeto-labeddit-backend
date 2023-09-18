import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';
import { CommentDatabase } from '../database/tables/CommentDatabase';
import { CreateCommentInputDTO, CreateCommentOutputDTO } from '../dto/comment/createComment.dto';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/NotFoundError';
import { COMMENT_LIKE, Comment, CommentWithCreatorDB, LikesDislikesCommentsDB } from '../models/Comments';
import { Post } from '../models/Posts';
import { PostDatabase } from '../database/tables/PostDatabase';
import { GetCommentInputDTO, GetCommentOutputDTO } from '../dto/comment/getComment.dto';
import { DeleteCommentInputDTO, DeleteCommentOutputDTO } from '../dto/comment/deleteComment.dto';
import { USER_ROLES } from '../models/Users';
import { LikeOrDislikeCommentInputDTO, LikeOrDislikeCommentOutputDTO } from '../dto/comment/likeOrDislikeComment.dto';
import { GetLikeDislikeInputDTO } from '../dto/comment/getLikeDislike.dto';
import { UnauthorizedError } from '../errors/UnauthorizedError';

export class CommentBusiness {
    constructor(
        private commentDatabase: CommentDatabase,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public createComment = async (input: CreateCommentInputDTO): Promise<CreateCommentOutputDTO> => {
        const { id, token, content } = input


        if (!token) {
            throw new BadRequestError("O campo 'token' é obrigatório.")
        }

        if (content.length === 0) {
            throw new BadRequestError("O campo 'content' não pode estar vazio.")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (!tokenPayload) {
            throw new BadRequestError("Token inválido ou expirado.")
        }

        const post = await this.commentDatabase.findPost(id)

        if (!post) {
            throw new NotFoundError("Post não encontrado.")
        }

        const commentId = this.idGenerator.generate()
        const creatorId = tokenPayload.id
        const creatorName = tokenPayload.name

        const comment = new Comment(
            commentId,
            id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            creatorId,
            creatorName
        )

        const newCommentDB = comment.toCommentDB()
        await this.commentDatabase.insertComment(newCommentDB)

        const updateCommentCount = new Post(
            post.id,
            post.content,
            post.likes,
            post.dislikes,
            post.comments_post,
            post.created_at,
            post.updated_at,
            post.creator_id,
            post.creator_name
        )
        updateCommentCount.addCommentsPosts()

        const postDB = updateCommentCount.toDBModel()
        await this.postDatabase.updatePost(postDB)

        const output: CreateCommentOutputDTO = undefined

        return output
    }

    public getComment = async (input: GetCommentInputDTO): Promise<GetCommentOutputDTO> => {
        const { id, token } = input

        if (token === undefined) {
            throw new BadRequestError("O campo 'token' é obrigatório.")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const commentsDB: CommentWithCreatorDB[] = await this.commentDatabase.getComment(id)

        if (!commentsDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const comments = commentsDB.map((commentDB) => {
            const comment = new Comment(
                commentDB.id,
                commentDB.post_id,
                commentDB.content,
                commentDB.likes,
                commentDB.dislikes,
                commentDB.created_at,
                commentDB.updated_at,
                commentDB.creator_id,
                commentDB.creator_name
            )
            return comment.toModel()
        })

        const output: GetCommentOutputDTO = comments

        return output


    }

    public deleteComment = async (input: DeleteCommentInputDTO): Promise<DeleteCommentOutputDTO> => {
        const { commentId, postId, token } = input

        if (token === undefined) {
            throw new BadRequestError("O campo 'token' é obrigatório.")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const commentToDeleteDB = await this.commentDatabase.findComment(commentId)

        if (!commentToDeleteDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = tokenPayload.id

        if (
            tokenPayload.role !== USER_ROLES.ADMIN &&
            commentToDeleteDB.creator_id !== creatorId
        ) {
            throw new BadRequestError("usuário não autorizado a deletar este post")
        }

        await this.commentDatabase.deleteComment(commentId)

        const post = await this.commentDatabase.findPost(postId)

        if (!post) {
            throw new NotFoundError("Post não encontrado.")
        }

        const updateCommentCount = new Post(
            post.id,
            post.content,
            post.likes,
            post.dislikes,
            post.comments_post,
            post.created_at,
            post.updated_at,
            post.creator_id,
            post.creator_name
        )
        updateCommentCount.removeCommentsPosts()

        const postDB = updateCommentCount.toDBModel()
        await this.postDatabase.updatePost(postDB)

        const output: DeleteCommentOutputDTO = undefined

        return output
    }

    public likeOrDislikeComment = async (input: LikeOrDislikeCommentInputDTO): Promise<LikeOrDislikeCommentOutputDTO> => {
        const { commentId, token, like } = input

        if (token === undefined) {
            throw new BadRequestError("O campo 'token' é obrigatório.")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const commentDBWithCreatorName = await this.commentDatabase.findCommentWithCreatorId(commentId)
        if (!commentDBWithCreatorName) {
            throw new NotFoundError("'id' não encontrado")
        }

        const comment = new Comment(
            commentDBWithCreatorName.id,
            commentDBWithCreatorName.post_id,
            commentDBWithCreatorName.content,
            commentDBWithCreatorName.likes,
            commentDBWithCreatorName.dislikes,
            commentDBWithCreatorName.created_at,
            commentDBWithCreatorName.updated_at,
            commentDBWithCreatorName.creator_id,
            commentDBWithCreatorName.creator_name
        )
        const likeDB = like ? 1 : 0

        const likeDislikeCommentsDB: LikesDislikesCommentsDB = {
            user_id: payload.id,
            comments_id: commentId,
            like: likeDB
        }

        const likeDislikeExists = await this.commentDatabase.findLikeDislike(likeDislikeCommentsDB)

        if (likeDislikeExists === COMMENT_LIKE.ON_LIKED) {
            if (like) {
                await this.commentDatabase.removeLikeDislike(likeDislikeCommentsDB)
                comment.removeLike()
            } else {
                await this.commentDatabase.updateLikeDislike(likeDislikeCommentsDB)
                comment.removeLike()
                comment.addDislike()
            }
        } else if (likeDislikeExists === COMMENT_LIKE.ON_DISLIKED) {
            if (!like) {
                await this.commentDatabase.removeLikeDislike(likeDislikeCommentsDB)
                comment.removeDislike()

            } else {
                await this.commentDatabase.updateLikeDislike(likeDislikeCommentsDB)
                comment.removeDislike()
                comment.addLike()
            }
        } else {
            await this.commentDatabase.likeOrDislikeComment(likeDislikeCommentsDB)

            like ? comment.addLike() : comment.addDislike()

        }

        const updateCommentDB = comment.toCommentDB()
        await this.commentDatabase.updateComment(updateCommentDB)

        const output: LikeOrDislikeCommentOutputDTO = undefined

        return output
    }

    public getLikeDislikeComment = async (input: GetLikeDislikeInputDTO): Promise<any> => {
        const { commentId, userId, token } = input

        const userToken = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError("Token inválido ou expirado. Faça login novamente.")
        }

        const likeDislikeDB: LikesDislikesCommentsDB = {
            user_id: userToken.id,
            comments_id: commentId,
            like: 1
        }

        const likeDislikeExists = await this.commentDatabase.findLikeDislike(likeDislikeDB)

        return likeDislikeExists
    }
}
