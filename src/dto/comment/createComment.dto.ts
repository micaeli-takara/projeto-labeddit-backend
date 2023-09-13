import z from 'zod'

export interface CreateCommentInputDTO {
    id: string,
    content: string,
    token: string
}

export type CreateCommentOutputDTO = undefined

export const CreateCommentSchema = z.object({
    id: z.string().min(1),
    content: z.string().min(1).max(480),
    token: z.string().min(1)
}).transform(data => data as CreateCommentInputDTO)
