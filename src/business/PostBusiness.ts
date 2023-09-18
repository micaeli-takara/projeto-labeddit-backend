import { PostDatabase } from "../database/tables/PostDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dto/post/createPost.dto";
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dto/post/deletePost.dto";
import { GetLikeDislikeInputDTO } from "../dto/post/getLikeDislike.dto";
import { GetPostInputDTO, GetPostOutputDTO } from "../dto/post/getPost.dto";
import { LikeOrDislikePostInputDTO, LikeOrDislikePostOutputDTO } from "../dto/post/likeOrDislikePost.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { LikeDislikeDB, POST_LIKE, Post, PostWithCreatorDB } from "../models/Posts";
import { USER_ROLES } from "../models/Users";
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
            throw new UnauthorizedError("Token inválido ou expirado. Faça login novamente.")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const id = this.idGenerator.generate()
        const creatorId = tokenPayload.id
        const creatorName = tokenPayload.name

        const post = new Post(
            id,
            content,
            0,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            creatorId,
            creatorName
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
            throw new UnauthorizedError("Token inválido ou expirado. Faça login novamente.")
        }

        const postsDB: PostWithCreatorDB[] = await this.postDatabase.getPosts()

        const posts = postsDB.map((postsDB) => {
            const post = new Post(
                postsDB.id,
                postsDB.content,
                postsDB.likes,
                postsDB.dislikes,
                postsDB.comments_post,
                postsDB.created_at,
                postsDB.updated_at,
                postsDB.creator_id,
                postsDB.creator_name
            )

            return post.toModel()
        })
        const output: GetPostOutputDTO = posts

        return output
    }

    public deletePost = async (
        input: DeletePostInputDTO
    ): Promise<DeletePostOutputDTO> => {
        const { token, idToDelete } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError("Token inválido ou expirado. Faça login novamente.")
        }

        const postDB = await this.postDatabase.findPostById(idToDelete)

        if (!postDB) {
            throw new NotFoundError("Postagem não encontrada.")
        }

        if (payload.role !== USER_ROLES.ADMIN) {
            if (payload.id !== postDB.creator_id) {
                throw new ForbiddenError("Você não tem permissão para excluir esta postagem")
            }
        }

        await this.postDatabase.deletePostById(idToDelete)

        const output: DeletePostOutputDTO = undefined

        return output
    }

    public likeOrDislikePost = async (
        input: LikeOrDislikePostInputDTO
    ): Promise<LikeOrDislikePostOutputDTO> => {
        const { postId, token, like } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError("Token inválido ou expirado. Faça login novamente.")
        }

        const postDBWithCreatorName = await this.postDatabase.findPostCreatorById(postId)
        if (!postDBWithCreatorName) {
            throw new NotFoundError("Postagem não encontrada.")
        }

        const post = new Post(
            postDBWithCreatorName.id,
            postDBWithCreatorName.content,
            postDBWithCreatorName.likes,
            postDBWithCreatorName.dislikes,
            postDBWithCreatorName.comments_post,
            postDBWithCreatorName.created_at,
            postDBWithCreatorName.updated_at,
            postDBWithCreatorName.creator_id,
            postDBWithCreatorName.creator_name
        )

        const likeSQLite = like ? 1 : 0

        const likeDislikeDB: LikeDislikeDB = {
            user_id: payload.id,
            post_id: postId,
            like: likeSQLite
        }

        const likeDislikeExists = await this.postDatabase.findLikeDislike(likeDislikeDB)

        if (likeDislikeExists === POST_LIKE.ON_LIKED) {
            if (like) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeLike()

            } else {
                await this.postDatabase.updatedLikeDislike(likeDislikeDB)
                post.removeLike()
                post.addDislike()

            }
        } else if (likeDislikeExists === POST_LIKE.ON_DISLIKED) {
            if (!like) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeDislike()

            } else {
                await this.postDatabase.updatedLikeDislike(likeDislikeDB)
                post.removeDislike()
                post.addLike()

            }
        } else {
            await this.postDatabase.insertLikeDislike(likeDislikeDB)
            like ? post.addLike() : post.addDislike()
            
        }
        const updatedPostDB = post.toDBModel()
        await this.postDatabase.updatePost(updatedPostDB)

        const output: LikeOrDislikePostOutputDTO = undefined

        return output
    }
    
    public getLikeDislike = async (
        input: GetLikeDislikeInputDTO): Promise<any> => {
        const {postId, userId, token } = input

        const userToken = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError("Token inválido ou expirado. Faça login novamente.")
        } 

        const likeDislikeDB: LikeDislikeDB = {
            user_id: userToken.id,
            post_id: postId,
            like: 1
        }

        const likeDislikeExists = await this.postDatabase.findLikeDislike(likeDislikeDB)    
        
        return likeDislikeExists
    }
}