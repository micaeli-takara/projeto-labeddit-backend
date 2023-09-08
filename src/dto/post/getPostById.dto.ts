import z from 'zod'
import { PostModel } from '../../models/Posts'

export interface GetPostByIdInputDTO{
    postId: string,
    token: string
}

export type GetPostByIdOutputDTO = PostModel

export const GetPostByIdSchema = z.object({
    postId: z.string().min(1),
    token: z.string().min(1)
}).transform(data => data as GetPostByIdInputDTO)