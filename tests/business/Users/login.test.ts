import { UserBusiness } from "../../../src/business/UserBusiness";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { LoginSchema } from "../../../src/dto/user/login.dto";
import { BadRequestError } from "../../../src/errors/BadRequestError";

describe("Teste de Login do Usuário", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    );

    test("Login bem-sucedido para usuário válido", async () => {
        const input = LoginSchema.parse({
            email: "astrodev@email.com",
            password: "astrodev99"
        });

        const output = await userBusiness.login(input);

        expect(output).toEqual({ token: "token-mock-astrodev" });
    });

    test("Erro ao inserir email inválido", async () => {
        const input = LoginSchema.parse({
            email: "email@invalido.com",
            password: "astrodev99"
        });

        await expect(userBusiness.login(input)).rejects.toThrow(BadRequestError);
    });

    test("Erro ao inserir senha inválida", async () => {
        const input = LoginSchema.parse({
            email: "astrodev@email.com",
            password: "senhainvalida"
        });

        await expect(userBusiness.login(input)).rejects.toThrow(BadRequestError);
    });
});
