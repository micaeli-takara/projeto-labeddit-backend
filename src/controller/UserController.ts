import { UserBusiness } from "../business/UserBusiness";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { Request, Response } from "express";
import { SignupSchema } from "../dto/signup.dto";
import { LoginSchema } from "../dto/login.dto";

export class UserController {
    constructor(
        private userBusiness: UserBusiness
    ) { }

    public signup = async (req: Request, res: Response) => {
        try {

            const input = SignupSchema.parse({
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: req.body.password,
                agreeToEmails: req.body.agreeToEmails
            })

            const output = await this.userBusiness.signup(input)

            res.status(201).send(output)

        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro Inesperado")
            }
        }
    }

    public login = async (req: Request, res: Response) => {
        try {
            const input = LoginSchema.parse ({
                email: req.body.email,
                password: req.body.password
            })

            const output = await this.userBusiness.login(input)

            res.status(201).send(output)

        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro Inesperado")
            }
        }
    }
}