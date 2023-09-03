import z from 'zod'
import { LikeDislikeDB, PostModel } from '../../models/Posts'

export interface GetLikeDislikeInputDTO{
    token: string,
    userId: string,
    postId: string
}

export type GetLikeDislikeOutputDTO = LikeDislikeDB[]

export const GetLikeDislikeSchema = z.object({
    token: z.string().min(1),
    userId: z.string().min(1),
    postId: z.string().min(1)
}).transform(data => data as GetLikeDislikeInputDTO)