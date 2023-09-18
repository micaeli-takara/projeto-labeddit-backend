import express from 'express';
import { CommentController } from '../controller/CommentController';
import { CommentBusiness } from '../business/CommentBusiness';
import { CommentDatabase } from '../database/tables/CommentDatabase';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';
import { PostDatabase } from '../database/tables/PostDatabase';

export const commentRouter = express.Router();

const commentController = new CommentController(
    new CommentBusiness(
        new CommentDatabase(),
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager()
    )
)

commentRouter.post("/:id/post", commentController.createComment)

commentRouter.get("/:id/post", commentController.getComment)

commentRouter.delete("/:commentId/:postId", commentController.deleteComment)

commentRouter.put("/:id/like", commentController.likeOrDislikeComment)

commentRouter.get("/:commentId/:userId/like", commentController.getLikeDislikeComment);