import z from 'zod'
import { CommentModel } from '../../models/Comments'

export interface GetCommentInputDTO{
    id: string,
    token: string
}

export type GetCommentOutputDTO = CommentModel[]

export const GetCommentSchema = z.object({
    id: z.string().min(1),
    token: z.string().min(1)
}).transform(data => data as GetCommentInputDTO)