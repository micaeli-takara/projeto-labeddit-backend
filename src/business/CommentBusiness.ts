import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';
import { CommentDatabase } from '../database/tables/CommentDatabase';
import { CreateCommentInputDTO, CreateCommentOutputDTO } from '../dto/comment/createComment.dto';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/NotFoundError';
import { Comment, CommentWithCreatorDB, LikesDislikesCommentsDB } from '../models/Comments';
import { Post } from '../models/Posts';
import { CreatePostOutputDTO } from '../dto/post/createPost.dto';
import { PostDatabase } from '../database/tables/PostDatabase';
import { GetCommentInputDTO, GetCommentOutputDTO } from '../dto/comment/getComment.dto';
import { EditCommentInputDTO, EditCommentOutputDTO } from '../dto/comment/editComment.dto';
import { DeleteCommentInputDTO, DeleteCommentOutputDTO } from '../dto/comment/deleteComment.dto';
import { USER_ROLES } from '../models/Users';
import { LikeOrDislikeCommentInputDTO } from '../dto/comment/likeOrDislikeComment.dto';
import { LikeOrDislikePostOutputDTO } from '../dto/post/likeOrDislikePost.dto';

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
            post.comments_post + 1,
            post.created_at,
            post.updated_at,
            post.creator_id,
            post.creator_name
        )
        updateCommentCount.addCommentsPosts()

        const postDB = updateCommentCount.toDBModel()
        await this.postDatabase.updatePost(postDB)

        const output: CreatePostOutputDTO = undefined

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

    public editComment = async (input: EditCommentInputDTO):Promise<EditCommentOutputDTO> => {

        const { id, token, content } = input

        if (token === undefined) {
            throw new BadRequestError("O campo 'token' é obrigatório.")
        }

        if (content.length <= 0) {
            throw new BadRequestError("O campo 'content' não pode estar vazio.")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("O campo 'token' é obrigatório.")
        }

        const commentToEditDB = await this.commentDatabase.findComment(id)

        if (!commentToEditDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = tokenPayload.id

        if (commentToEditDB.creator_id !== creatorId) {
            throw new BadRequestError("usuário não autorizado a editar este comentário")
        }

        const creatorName = tokenPayload.name

        const commentToEdit = new Comment(
            commentToEditDB.id,
            commentToEditDB.post_id,
            commentToEditDB.content,
            commentToEditDB.likes,
            commentToEditDB.dislikes,
            commentToEditDB.created_at,
            commentToEditDB.updated_at,
            creatorId,
            creatorName
        )

        commentToEdit.setContent(content)
        commentToEdit.setUpdatedAt(new Date().toISOString())

        const updatedCommentDB = commentToEdit.toCommentDB()

        await this.commentDatabase.updateComment(updatedCommentDB)

        const output: EditCommentOutputDTO = undefined

        return output

    }

    public deleteComment = async (input: DeleteCommentInputDTO): Promise<DeleteCommentOutputDTO> => {
        const { id, token } = input

        if (token === undefined) {
            throw new BadRequestError("O campo 'token' é obrigatório.")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const commentToDeleteDB = await this.commentDatabase.findComment(id)

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

        await this.commentDatabase.deleteComment(id)

        const output: DeleteCommentOutputDTO = undefined

        return output
    }

    public likeOrDislikeComment = async (input:LikeOrDislikeCommentInputDTO): Promise<LikeOrDislikePostOutputDTO> => {
        const { id, token, like } = input

        if (token === undefined) {
            throw new BadRequestError("O campo 'token' é obrigatório.")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const likeDislikeCommentDB = await this.commentDatabase.findCommentWithCreatorId(id)

        if (!likeDislikeCommentDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const userId = tokenPayload.id
        const likeDB = like ? 1 : 0

        if (likeDislikeCommentDB.creator_id === userId) {
            throw new BadRequestError("Quem criou o post não pode dar 'like' ou 'dislike' no mesmo")
        }

        const likeDislikeDB: LikesDislikesCommentsDB = {
            user_id: userId,
            comments_id: likeDislikeCommentDB.id,
            like: likeDB
        }

        const comment = new Comment(
            likeDislikeCommentDB.id,
            likeDislikeCommentDB.post_id,
            likeDislikeCommentDB.content,
            likeDislikeCommentDB.likes,
            likeDislikeCommentDB.dislikes,
            likeDislikeCommentDB.created_at,
            likeDislikeCommentDB.updated_at,
            likeDislikeCommentDB.creator_id,
            likeDislikeCommentDB.creator_name
        )

        const likeDislikeExists = await this.commentDatabase.findLikeDislike(likeDislikeDB)

        if (likeDislikeExists === "already liked") {
            if (like) {
                await this.commentDatabase.removeLikeDislike(likeDislikeDB)
                comment.removeLike()
            } else {
                await this.commentDatabase.updateLikeDislike(likeDislikeDB)
                comment.removeLike()
                comment.addDislike()
            }
        } else if (likeDislikeExists === "already disliked") {
            if (like) {
                await this.commentDatabase.removeLikeDislike(likeDislikeDB)
                comment.removeDislike()
                comment.addLike()
            } else {
                await this.commentDatabase.updateLikeDislike(likeDislikeDB)
                comment.removeDislike()
            }
        } else {
            await this.commentDatabase.likeOrDislikeComment(likeDislikeDB)

            like ? comment.addLike() : comment.addDislike()

        }

        const updatedPostDB = comment.toCommentDB()
        await this.commentDatabase.updateComment(updatedPostDB)

        const output: LikeOrDislikePostOutputDTO = undefined

        return output
    }
}
