import { Request, Response } from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { BaseError } from "../errors/BaseError";
import { CreateCommentSchema } from "../dto/comment/createComment.dto";
import { ZodError } from "zod";
import { GetCommentSchema } from "../dto/comment/getComment.dto";
import { EditCommentSchema } from "../dto/comment/editComment.dto";
import { DeleteCommentSchema } from "../dto/comment/deleteComment.dto";
import { LikeOrDislikeCommentSchema } from "../dto/comment/likeOrDislikeComment.dto";

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

    public editComment = async (req: Request, res: Response) => {
        try {
            const input = EditCommentSchema.parse({
               id: req.params.id,
               token: req.headers.authorization,
               content: req.body.content
            });

            const output = await this.commentBusiness.editComment(input);

            res.status(201).send({
                message: "Comentário editado com sucesso!",
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


    public deleteComment = async (req: Request, res: Response) => {
        try {
            const input = DeleteCommentSchema.parse({  
                id: req.params.id,
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
                id: req.params.id,
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
}