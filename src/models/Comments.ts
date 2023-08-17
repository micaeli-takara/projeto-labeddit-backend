export interface CommentDB {
    id: string,
    post_id: string,
    user_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string
}

export interface CommentLikeDislikeDB {
    user_id: string,
    comment_id: string,
    like: number
}

export enum COMMENT_LIKE {
    ON_LIKED = "ON LIKED",
    ON_DISLIKED = "ON DISLIKED"
}


export interface CommentModel {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    post: {
        id: string,
        creatorId: string,
        creatorName: string,
        content: string,
        createdAt: string,
        updatedAt: string
    },
    user: {
        id: string,
        name: string
    }
}

export class Comment {
    constructor(
        private id: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private createdAt: string,
        private postId: string,
        private userId: string,
        private postContent: string,
        private postCreatedAt: string,
        private postUpdatedAt: string,
        private creatorId: string,
        private creatorName: string
    ) { }

    public getId(): string {
        return this.id;
    }
    public setId(value: string): void {
        this.id = value;
    }

    public getContent(): string {
        return this.content;
    }
    public setContent(value: string): void {
        this.content = value;
    }

    public getLikes(): number {
        return this.likes;
    }
    public setLikes(value: number): void {
        this.likes = value;
    }
    public addLike(): void {
        this.likes++;
    }
    public removeLike(): void {
        this.likes--;
    }

    public getDislikes(): number {
        return this.dislikes;
    }
    public setDislikes(value: number): void {
        this.dislikes = value;
    }
    public addDislike(): void {
        this.dislikes++;
    }
    public removeDislike(): void {
        this.dislikes--;
    }

    public getCreatedAt(): string {
        return this.createdAt;
    }
    public setCreatedAt(value: string): void {
        this.createdAt = value;
    }

    public getPostId(): string {
        return this.postId;
    }
    public setPostId(value: string): void {
        this.postId = value;
    }

    public getUserId(): string {
        return this.userId;
    }
    public setUserId(value: string): void {
        this.userId = value;
    }

    public getPostContent(): string {
        return this.postContent;
    }
    public setPostContent(value: string): void {
        this.postContent = value;
    }

    public getPostCreatedAt(): string {
        return this.postCreatedAt;
    }
    public setPostCreatedAt(value: string): void {
        this.postCreatedAt = value;
    }

    public getPostUpdatedAt(): string {
        return this.postUpdatedAt;
    }
    public setPostUpdatedAt(value: string): void {
        this.postUpdatedAt = value;
    }

    public getCreatorId(): string {
        return this.creatorId;
    }
    public setCreatorId(value: string): void {
        this.creatorId = value;
    }

    public getCreatorName(): string {
        return this.creatorName;
    }
    public setCreatorName(value: string): void {
        this.creatorName = value;
    }

    public toDBModel(): CommentDB {
        return {
            id: this.id,
            post_id: this.postId,
            user_id: this.userId,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.createdAt
        };
    }

    public toModel(): CommentModel {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            createdAt: this.createdAt,
            post: {
                id: this.postId,
                creatorId: this.creatorId,
                creatorName: this.creatorName,
                content: this.postContent,
                createdAt: this.postCreatedAt,
                updatedAt: this.postUpdatedAt
            },
            user: {
                id: this.userId,
                name: this.creatorName
            }
        };
    }
}
