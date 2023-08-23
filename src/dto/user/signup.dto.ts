import z from 'zod'

export interface SignupInputDTO {
    name: string,
    email: string,
    password: string,
}

export interface SignupOutputDTO {
    token: string
}

const MIN_PASSWORD_LENGTH = 7;
const STRONG_PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

export const SignupSchema = z.object({
    name: z.string().min(2), 
    email: z.string().email('O email fornecido não está em um formato válido.'),
    password: z.string().min(MIN_PASSWORD_LENGTH).regex(STRONG_PASSWORD_REGEX, 'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'),
}).transform(data => data as SignupInputDTO)