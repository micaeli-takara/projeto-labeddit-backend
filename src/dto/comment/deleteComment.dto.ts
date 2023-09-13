import z from 'zod'

export interface DeleteCommentInputDTO {
    commentId: string,
    postId: string,
    token: string
}

export type DeleteCommentOutputDTO = undefined

export const DeleteCommentSchema = z.object({
    commentId: z.string().min(1),
    postId: z.string().min(1),
    token: z.string().min(1) 
}).transform(data => data as DeleteCommentInputDTO)