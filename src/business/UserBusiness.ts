import { UserDatabase } from "../database/tables/UserDatabase";
import { LoginInputDTO, LoginOutputDTO } from "../dto/user/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../dto/user/signup.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { ConflictError } from "../errors/ConflictError";
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

    public signup = async (input: SignupInputDTO): Promise <SignupOutputDTO> => {
        const { name, email, password } = input;

        const existingUser = await this.userDatabse.findUserByEmail(email);
        
        if (existingUser) {
            throw new ConflictError("Este e-mail já está em uso. Por favor, escolha outro e-mail.");
        }
    
        const id = this.idGenerator.generate();
        const hashedPassword = await this.hashManager.hash(password);
    
        const user = new User(
            id,
            name,
            email,
            hashedPassword,
            USER_ROLES.NORMAL,
            new Date().toISOString()
        );
    
        const userDB = user.toDBModel();
        await this.userDatabse.insertUser(userDB);
    
        const payload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        };
    
        const token = this.tokenManager.createToken(payload);
    
        const output: SignupOutputDTO = {
            token
        }
    
        return output
    };

    public login = async (input: LoginInputDTO): Promise <LoginOutputDTO> => {
        const { email, password } = input

        const userDB = await this.userDatabse.findUserByEmail(email)

        if ( !userDB ) {
            throw new BadRequestError("e-mail e/ou senha inválido(s)")
        }

        const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at
        )

        const hashedPassword = user.getPassword()

        const isPasswordCorrect = await this.hashManager
            .compare(password, hashedPassword)

        if (!isPasswordCorrect) {
            throw new BadRequestError("E-mail e/ou senha inválidos. Por favor, verifique tente novamente.")
        }

        const payload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        }

        const token = this.tokenManager.createToken(payload)

        const output: LoginOutputDTO = {
            token
        }

        return output
    }
}