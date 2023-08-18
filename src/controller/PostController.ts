import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { CreatePostSchema } from "../dto/post/createPost.dto";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { GetPostSchema } from "../dto/post/getPost.dto";
import { EditPostSchema } from "../dto/post/editPost.dto";

export class PostController {
    constructor (
        private postBusiness: PostBusiness
    ) {}

    public createPost = async (req: Request, res: Response) => {
        try {
            const input = CreatePostSchema.parse({
                content: req.body.content,
                token: req.headers.authorization
            })

            const output = await this.postBusiness.createPost(input)

            res.status(201).send({
                message: "Postagem realizada com sucesso!",
                data: output
            })
        } catch (error) {
            console.log(error)

            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public getPost = async (req: Request, res: Response) => {
        try {

            const input = GetPostSchema.parse({
                token: req.headers.authorization
            })

            const output = await this.postBusiness.getPosts(input)

            res.status(201).send(output)
        } catch (error) {
            console.log(error)

            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public editPost = async (req: Request, res: Response) => {
        try {

            const input = EditPostSchema.parse({
                token: req.headers.authorization,
                content: req.body.content,
                idToEdit: req.params.id
            })

            const output = await this.postBusiness.editPost(input)

            res.status(200).send({
                message: "Postagem editada com sucesso!",
                data: output
            })
        } catch (error) {
            console.log(error)

            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

}