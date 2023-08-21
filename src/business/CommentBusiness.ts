import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';
import { CommentDatabase } from '../database/tables/CommentDatabase';
import { CreateCommentInputDTO, CreateCommentOutputDTO } from '../dto/comment/createComment.dto';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/NotFoundError';
import { Comment, CommentWithCreatorDB } from '../models/Comments';
import { Post } from '../models/Posts';
import { CreatePostOutputDTO } from '../dto/post/createPost.dto';
import { PostDatabase } from '../database/tables/PostDatabase';
import { GetCommentInputDTO, GetCommentOutputDTO } from '../dto/comment/getComment.dto';
import { EditCommentInputDTO, EditCommentOutputDTO } from '../dto/comment/editComment.dto';

export class CommentBusiness {
    constructor(
        private commentDatabase: CommentDatabase,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public createComment = async (input: CreateCommentInputDTO): Promise<CreateCommentOutputDTO> => {
        const { id, token, content } = input


        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        if (content.length <= 0) {
            throw new BadRequestError("'content' não pode ser zero ou negativo")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const post = await this.commentDatabase.findPost(id)

        if (!post) {
            throw new NotFoundError("'post' não encontrado")
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

        const output: CreatePostOutputDTO = undefined

        return output
    }

    public getComment = async (input: GetCommentInputDTO): Promise<GetCommentOutputDTO> => {
        const { id, token } = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
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
            throw new BadRequestError("'token' ausente")
        }

        if (content.length <= 0) {
            throw new BadRequestError("'content' não pode ser zero ou negativo")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
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
}
