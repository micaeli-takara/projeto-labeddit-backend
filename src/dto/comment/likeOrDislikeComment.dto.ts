import z from 'zod';

export interface LikeOrDislikeCommentInputDTO {
    id: string,
    token: string,
    like: boolean
}

export type LikeOrDislikeCommentOutputDTO = undefined


export const LikeOrDislikeCommentSchema = z.object({
    id: z.string().min(1),
    token: z.string().min(1),
    like: z.boolean()
}).transform(data => data as LikeOrDislikeCommentInputDTO)