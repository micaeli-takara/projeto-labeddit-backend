import { Request, Response } from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { BaseError } from "../errors/BaseError";
import { CreateCommentSchema } from "../dto/comment/createComment.dto";
import { ZodError } from "zod";
import { GetCommentSchema } from "../dto/comment/getComment.dto";
import { DeleteCommentSchema } from "../dto/comment/deleteComment.dto";
import { LikeOrDislikeCommentSchema } from "../dto/comment/likeOrDislikeComment.dto";
import { GetLikeDislikeSchema } from "../dto/comment/getLikeDislike.dto";

export class CommentController {
    constructor (
        private commentBusiness: CommentBusiness
    ) {}

    public createComment = async (req: Request, res: Response) => {
        try {
            const input = CreateCommentSchema.parse({
                id: req.params.id,
                token: req.headers.authorization,
                content: req.body.content
            });

            if (input.content.length > 480) {
                res.status(400).send("O conteúdo do post não pode exceder 480 caracteres.");
                return;
            }

            const output = await this.commentBusiness.createComment(input);

            res.status(201).send({
                message: "Comentário criado com sucesso!",
                output
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
    
    public getComment = async (req: Request, res: Response) => {
        try {
            const input = GetCommentSchema.parse({
                id: req.params.id,
                token: req.headers.authorization
            })

            const output = await this.commentBusiness.getComment(input)

            res.status(200).send(output)
            
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

    public deleteComment = async (req: Request, res: Response) => {
        try {
            const input = DeleteCommentSchema.parse({  
                commentId: req.params.commentId,
                postId: req.params.postId,
                token: req.headers.authorization
            });

            const output = await this.commentBusiness.deleteComment(input);

            res.status(200).send({
                message: "Comentário deletado com sucesso!",
                output
            });

        } catch (error) {
            console.log(error);

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send("Erro inesperado");
            }
        }
    }

    public likeOrDislikeComment = async (req: Request, res: Response) => {
        try {
            const input = LikeOrDislikeCommentSchema.parse({                
                commentId: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            });

            const output = await this.commentBusiness.likeOrDislikeComment(input);

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
            console.log(error);

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send("Erro inesperado");
            }
        }
    }

    public getLikeDislikeComment = async (req: Request, res: Response) => {
        try {
            const input = GetLikeDislikeSchema.parse({
                userId: req.params.userId,
                commentId: req.params.commentId,
                token: req.headers.authorization
            })
            
            const output = await this.commentBusiness.getLikeDislikeComment(input)

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