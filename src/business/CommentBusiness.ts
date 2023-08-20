import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';
import { CommentDatabase } from '../database/tables/CommentDatabase';
import { CreateCommentInputDTO, CreateCommentOutputDTO } from '../dto/comment/createComment.dto';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/NotFoundError';
import { Comment } from '../models/Comments';
import { Post } from '../models/Posts';
import { CreatePostOutputDTO } from '../dto/post/createPost.dto';
import { PostDatabase } from '../database/tables/PostDatabase';

export class CommentBusiness {
    constructor(
        private commentDatabase: CommentDatabase,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public createComment = async (
        input: CreateCommentInputDTO
    ): Promise<CreateCommentOutputDTO> => {
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

        const newCommentDB = comment.toCommentDBModel()
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
}
