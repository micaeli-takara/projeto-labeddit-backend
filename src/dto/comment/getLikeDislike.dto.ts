import z from 'zod'
import { LikesDislikesCommentsDB } from '../../models/Comments'

export interface GetLikeDislikeInputDTO{
    token: string,
    userId: string,
    commentId: string
}

export type GetLikeDislikeOutputDTO = LikesDislikesCommentsDB

export const GetLikeDislikeSchema = z.object({
    token: z.string().min(1),
    userId: z.string().min(1),
    commentId: z.string().min(1)
}).transform(data => data as GetLikeDislikeInputDTO)