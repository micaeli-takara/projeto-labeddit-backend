import { PostDatabase } from "../database/tables/PostDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dto/post/createPost.dto";
import { GetPostInputDTO, GetPostOutputDTO } from "../dto/post/getPost.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Post } from "../models/Posts";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public createPost = async (
        input: CreatePostInputDTO
    ): Promise<CreatePostOutputDTO> => {
        const { content, token } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const id = this.idGenerator.generate()

        const post = new Post(
            id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.name
        )

        const postDB = post.toDBModel()
        await this.postDatabase.insertPost(postDB)

        const output: CreatePostOutputDTO = undefined

        return output
    }

    public getPosts = async (
        input: GetPostInputDTO
    ): Promise<GetPostOutputDTO> => {
        const { token } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const postDBWithCreatorName = await this.postDatabase.getPostsWithCreatorsName()

        const posts = postDBWithCreatorName.map((postWithCreatorName) => {
            const post = new Post(
                postWithCreatorName.id,
                postWithCreatorName.content,
                postWithCreatorName.likes,
                postWithCreatorName.dislikes,
                postWithCreatorName.created_at,
                postWithCreatorName.updated_at,
                postWithCreatorName.creator_id,
                postWithCreatorName.creator_name
            )

            return post.toModel()
        })
        const output: GetPostOutputDTO = posts

        return output
    }
}