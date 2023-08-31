import { UserBusiness } from "../../../src/business/UserBusiness";
import { SignupSchema } from "../../../src/dto/user/signup.dto";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { USER_ROLES } from "../../../src/models/Users";
import { ConflictError } from "../../../src/errors/ConflictError";

describe("Testando o cadastro de usuário", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    );

    test("deve gerar token ao cadastrar", async () => {
        const input = SignupSchema.parse({
            name: "Ciclana",
            email: "ciclana@email.com",
            password: "Ciclana321@"
        });

        const output = await userBusiness.signup(input);

        expect(output).toEqual({
            token: "token-mock"
        });
    });

    test("deve lançar erro ao tentar cadastrar com email já existente", async () => {
        const input = SignupSchema.parse({
            name: "Fulano",
            email: "fulano@email.com",
            password: "Fulano123@"
        });

        await expect(userBusiness.signup(input)).rejects.toThrow(ConflictError);
    });


    test("deve criar um token para usuário normal", () => {
        const tokenManager = new TokenManagerMock();

        const payload = {
            id: "id-mock-fulano",
            name: "Fulano",
            role: USER_ROLES.NORMAL
        };

        const token = tokenManager.createToken(payload);

        expect(token).toBe("token-mock-fulano");
    });

    test("deve comparar uma senha hash", async () => {
        const hashManager = new HashManagerMock();

        const senhaTextoPlano = "fulano123";
        const senhaHash = "hash-mock-fulano";

        const resultado = await hashManager.compare(senhaTextoPlano, senhaHash);

        expect(resultado).toBe(true);
    });
});
