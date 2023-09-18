import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { CreatePostSchema } from "../dto/post/createPost.dto";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { GetPostSchema } from "../dto/post/getPost.dto";
import { DeletePostSchema } from "../dto/post/deletePost.dto";
import { LikeOrDislikePostSchema } from "../dto/post/likeOrDislikePost.dto";
import { GetLikeDislikeSchema } from "../dto/post/getLikeDislike.dto";

export class PostController {
    constructor (
        private postBusiness: PostBusiness
    ) {}

    public createPost = async (req: Request, res: Response) => {
        try {
            const input = CreatePostSchema.parse({
                content: req.body.content,
                token: req.headers.authorization
            });
    
            if (input.content.length > 480) {
                res.status(400).send("O conteúdo do post não pode exceder 480 caracteres.");
                return;
            }
    
            const output = await this.postBusiness.createPost(input);
    
            res.status(201).send({
                message: "Postagem realizada com sucesso!",
                data: output
            });
        } catch (error) {
            console.log(error);
    
            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send("Erro inesperado");
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

    public deletePost = async (req: Request, res: Response) => {
        try {

            const input = DeletePostSchema.parse({
                token: req.headers.authorization,
                idToDelete: req.params.id
            })

            const output = await this.postBusiness.deletePost(input)

            res.status(200).send({
                messege: "Postagem deletada com sucesso!",
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

    public likeOrDislikePost = async (req: Request, res: Response) => {
        try {
            const input = LikeOrDislikePostSchema.parse({
                postId: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            })
            
            const output = await this.postBusiness.likeOrDislikePost(input)

            let message;
            if (input.like) {
                message = "Comentário curtido com sucesso!";
            } else {
                message = "Comentário descurtido com sucesso!";
            }

            res.status(200).send({
                message,
                output
            });

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
    
    public getLikeDislike = async (req: Request, res: Response) => {
        try {
            const input = GetLikeDislikeSchema.parse({
                postId: req.params.postId,
                userId: req.params.userId,
                token: req.headers.authorization
            })
            
            const output = await this.postBusiness.getLikeDislike(input)

            res.status(200).send(output);

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