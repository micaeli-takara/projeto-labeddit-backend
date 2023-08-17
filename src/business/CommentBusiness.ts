import { CommentDatabse } from "../database/tables/CommentDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class CommentBusiness {
    constructor (
        private commentDatabase: CommentDatabse,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) {}
}