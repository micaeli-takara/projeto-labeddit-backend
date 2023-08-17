import { UserDatabase } from "../database/tables/UserDatabase";
import { SignupInputDTO, SignupOutputDTO } from "../dto/signup.dto";
import { TokenPayload, USER_ROLES, User } from "../models/Users";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class UserBusiness {
    constructor(
        private userDatabse: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) { }

    public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
        const { name, surname, email, password } = input
        
        const id = this.idGenerator.generate()

        const hashedPassword = await this.hashManager.hash(password)

        const user = new User(
            id,
            name,
            surname,
            email,
            hashedPassword,
            USER_ROLES.NORMAL,
            new Date().toISOString()
        )

        const userDB = user.toDBModel()
        await this.userDatabse.insertUser(userDB)

        const payload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        }

        const token = this.tokenManager.createToken(payload)

        const output: SignupOutputDTO = {
            token
        }

        return output
    }
}