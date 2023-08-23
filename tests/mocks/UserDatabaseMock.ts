import { USER_ROLES, UserDB } from "../../src/models/Users";
import { BaseDatabase } from "../../src/database/BaseDatabase";

const usersMock: UserDB[] = [
  {
    id: "id-mock-fulano",
    name: "Fulano",
    email: "fulano@email.com",
    password: "hash-mock-fulano", // senha = "fulano123"
    created_at: new Date().toISOString(),
    role: USER_ROLES.NORMAL
  },
  {
    id: "id-mock-astrodev",
    name: "Astrodev",
    email: "astrodev@email.com",
    password: "hash-mock-astrodev", // senha = "astrodev99"
    created_at: new Date().toISOString(),
    role: USER_ROLES.ADMIN
  },
]

export class UserDatabaseMock extends BaseDatabase {

  public async insertUser(
    newUserDB: UserDB
  ): Promise<void> {

  }

  public async findUserByEmail(
    email: string
  ): Promise<UserDB | undefined> {
    return usersMock.filter(user => user.email === email)[0]
  }
}  