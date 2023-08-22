import z from 'zod'

export interface DeleteCommentInputDTO {
    id: string,
    token: string
}

export type DeleteCommentOutputDTO = undefined

export const DeleteCommentSchema = z.object({
    id: z.string().min(1),
    token: z.string().min(1) 
}).transform(data => data as DeleteCommentInputDTO)