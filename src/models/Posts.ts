export interface PostDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    comments_post: number,
    created_at: string,
    updated_at: string
}

export interface PostModel {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    commentsPost: number,
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        name: string
    }
}

export interface PostWithCreatorDB extends PostDB {
    creator_name: string
}

export interface LikeDislikeDB {
    user_id: string,
    post_id: string,
    like: number
}

export interface GetLikeDislikeDB {
    user_id: string,
    post_id: string
}

export enum POST_LIKE {
    ON_LIKED = "ON LIKED",
    ON_DISLIKED = "ON DISLIKED"
}

export class Post {
    constructor(
        private id: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private commentsPost: number,
        private createdAt: string,
        private updatedAt: string,
        private creatorId: string,
        private creatorName: string
    ) { }

    public getId(): string {
        return this.id
    }
    public setId(value: string): void {
        this.id = value
    }

    public getContent(): string {
        return this.content
    }
    public setContent(value: string): void {
        this.content = value
    }
    public getLikes(): number {
        return this.likes
    }
    public setLikes(value: number): void {
        this.likes = value
    }
    public addLike = (): void => {
        this.likes++
    }
    public removeLike = (): void => {
        this.likes--
    }
    public getDislikes(): number {
        return this.dislikes
    }
    public setDislikes(value: number): void {
        this.dislikes = value
    }
    public addDislike = (): void => {
        this.dislikes++
    }
    public removeDislike = (): void => {
        this.dislikes--
    }
    public getCommentsPost(): number {
        return this.commentsPost
    }
    public setCommentsPost(value: number): void {
        this.commentsPost = value
    }

    public addCommentsPosts = (): void => {
        this.commentsPost++
    }
    public removeCommentsPosts = (): void => {
        this.commentsPost--
    }

    public getCreatedAt(): string {
        return this.createdAt
    }
    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

    public getUpdatedAt(): string {
        return this.updatedAt
    }
    public setUpdatedAt(value: string): void {
        this.updatedAt = value
    }

    public getCreatorId(): string {
        return this.creatorId
    }
    public setCreatorId(value: string): void {
        this.creatorId = value
    }

    public getCreatorName(): string {
        return this.creatorName;
    }
    public setCreatorName(value: string): void {
        this.creatorName = value;
    }

    public toDBModel(): PostDB {
        return {
            id: this.id,
            creator_id: this.creatorId,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            comments_post: this.commentsPost,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        };
    }

    public toModel(): PostModel {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            commentsPost: this.commentsPost,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            creator: {
                id: this.creatorId,
                name: this.creatorName
            }
        };
    }
}   