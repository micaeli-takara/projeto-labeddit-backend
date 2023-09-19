# Documentação da API LabEddit-backend

O projeto Labeddit Full Stack é um desafio final do bootcamp Web Full Stack da Labenu, que abrange desenvolvimento em backend e frontend. O foco é criar um aplicativo com design mobile-first, com ênfase na parte de backend. Isso envolve a criação de uma API usando TypeScript, Knex e Express, implementando funcionalidades como autenticação de usuários e gerenciamento de banco de dados.

## [Link do repositório Front-end](https://github.com/micaeli-takara/projeto-labeddit-frontend)

## Documentação

[Documentação da API](https://documenter.getpostman.com/view/27685885/2s9YC8xBKG)


# POST Signup

```https
  POST https://projeto-labeddit-backend-88qh.onrender.com/users/signup
```

### Criar um usuário

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `name` | `string` | **Obrigatório**. Nome do usuário. |
| `email` | `string` | **Obrigatório**. E-mail do usuário |
| `password` | `string` | **Obrigatório**. Senha do usuário |

## Body:
```json
{
    "name": "Visitante",
    "email": "visitante@gmail.com",
    "password": "Visitante123@"
}
```

## Exemplo de resposta:
```json

{
  "message": "Cadastro realizado com sucesso",
  "output": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUwNzdiMjViLTQzMzgtNGI5MC1hMjc3LTdiYzQyYTA3YzU0MiIsIm5hbWUiOiJWaXNpdGFudGUiLCJyb2xlIjoiTk9STUFMIiwiaWF0IjoxNjk1MTQ0MDIxLCJleHAiOjE2OTU4MzUyMjF9.anNmGxLdjvfbFc2oendmsWIU0C6xyKnAwZ0ErfB3tAg"
  }
}
```

# POST Login

```https
  POST https://projeto-labeddit-backend-88qh.onrender.com/users/login
```

### Logar um usuário

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `email` | `string` | **Obrigatório**. Email do usuário. 
| `password` | `string` | **Obrigatório**. Senha do usuário |

## Body:
```json
{
    "email": "visitante@gmail.com",
    "password": "Visitante123@"
}
```

## Exemplo de resposta:
```json
{
  "message": "Login realizado com sucesso. Seja bem-vindo(a)",
  "output": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUwNzdiMjViLTQzMzgtNGI5MC1hMjc3LTdiYzQyYTA3YzU0MiIsIm5hbWUiOiJWaXNpdGFudGUiLCJyb2xlIjoiTk9STUFMIiwiaWF0IjoxNjk1MTQ0NDg1LCJleHAiOjE2OTU4MzU2ODV9.HxBlqzlL0WJQBzY8O6dHjS6biolMlGq4acVFg2PBj4c"
  }
}
```

# POST CreatePost

```https
  POST https://projeto-labeddit-backend-88qh.onrender.com/posts/
```

### Parâmetros de consulta:

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `Authorization`      | `key` | **Obrigatório**. A autorização do usuário será gerada no signup ou login |

## Body:
```json
{
    "content": "Primeira Postagem!"
}
```

## Exemplo de resposta:
```json
[
  {
    "id": "baac81c6-a3a1-46c8-924a-00476c38dcde",
    "content": "Primeira Postagem!",
    "likes": 0,
    "dislikes": 0,
    "commentsPost": 0,
    "createdAt": "2023-09-19T17:33:38.417Z",
    "updatedAt": "2023-09-19T17:33:38.417Z",
    "creator": {
      "id": "e077b25b-4338-4b90-a277-7bc42a07c542",
      "name": "Visitante"
    }
  }
]
```

# GET Posts

```https
  GET https://projeto-labeddit-backend-88qh.onrender.com/posts/
```

### Parâmetros de caminho:

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Authorization` | `key` | **Obrigatório**. A autorização do usuário |

## Exemplo de resposta:
```json
[
  {
    "id": "baac81c6-a3a1-46c8-924a-00476c38dcde",
    "content": "Primeira Postagem!",
    "likes": 0,
    "dislikes": 0,
    "commentsPost": 0,
    "createdAt": "2023-09-19T17:33:38.417Z",
    "updatedAt": "2023-09-19T17:33:38.417Z",
    "creator": {
      "id": "e077b25b-4338-4b90-a277-7bc42a07c542",
      "name": "Visitante"
    }
  }
]
```

# DELETE Delete Post

Endpoint para exclusão de postagens no Labeddit. Apenas usuários com privilégios de administrador têm permissão para remover qualquer postagem, enquanto os demais usuários podem apagar somente as suas próprias postagens.


```https
   DELETE https://projeto-labeddit-backend-88qh.onrender.com/posts/:id
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Authorization` | `key` | **Obrigatório**. A autorização do usuário |
| `id` | `Path Variables` | **Obrigatório**. O Id da postagem que será deletada |

### Exemplo de resposta:

```json
{
    "messege": "Postagem deletada com sucesso!"
}
```

# PUT LikeOrDislike Post
Endpoint para ação de 'like' e 'dislike' em postagens. Se desejar remover a curtida de uma postagem, basta executar a ação de 'like' novamente, definindo-a como 'true', o mesmo vale para o "dislike".

```https
  POST https://projeto-labeddit-backend-88qh.onrender.com/posts/:id/like
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Authorization` | `key` | **Obrigatório**. A autorização do usuário |
| `id` | `Path Variables` | **Obrigatório**. O Id da postagem que receberá o like ou o dislike |

## Body:
Para dar like:
```json
{
    "like": true
}
```

para tirar o like:
```json
{
    "like": false
}
```
### Exemplo de resposta:

```json
{
  "message": "Comentário curtido com sucesso!"
}
```

ou
```json
{
  "message": "Comentário descurtido com sucesso!"
}
```

# POST Create Comment

```https
  POST https://projeto-labeddit-backend-88qh.onrender.com/comments/:id/post
```

### Parâmetros de consulta:

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `Authorization`      | `key` | **Obrigatório**. A autorização do usuário será gerada no signup ou login |

## Body:
```json
{
    "content": "Adorei!"
}
```

## Exemplo de resposta:
```json
{
  "message": "Comentário criado com sucesso!"
}
```

# GET Comments

```https
  GET https://projeto-labeddit-backend-88qh.onrender.com/comments/:id/post
```

### Parâmetros de caminho:

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Authorization` | `key` | **Obrigatório**. A autorização do usuário |
| `id` | `Path Variables` | **Obrigatório**. O Id da postagem |

## Exemplo de resposta:
```json
[
  {
    "id": "5233ef4b-df34-4345-a35b-9833d8ea74fa",
    "postId": "baac81c6-a3a1-46c8-924a-00476c38dcde",
    "content": "Adorei!",
    "likes": 0,
    "dislikes": 0,
    "createdAt": "2023-09-19T17:38:21.412Z",
    "updatedAt": "2023-09-19T17:38:21.412Z",
    "creator": {
      "id": "e077b25b-4338-4b90-a277-7bc42a07c542",
      "name": "Visitante"
    }
  }
]
```

# DELETE Delete Comment

Endpoint para exclusão de um comentário do Labeddit. Apenas usuários com privilégios de administrador têm permissão para remover qualquer comentário, enquanto os demais usuários podem apagar somente seus próprios comentários.


```https
   DELETE https://projeto-labeddit-backend-88qh.onrender.com/comments/:commentId/:postId
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Authorization` | `key` | **Obrigatório**. A autorização do usuário |
| `commentId` | `Path Variables` | **Obrigatório**. O Id do comentário que será deletado |
| `postId` | `Path Variables` | **Obrigatório**. O Id da postagem onde o comentário está |

### Exemplo de resposta:

```json
{
  "message": "Comentário deletado com sucesso!"
}
```

# PUT LikeOrDislike Comment

Endpoint para ação de 'like' e 'dislike' em comentários. Se desejar remover a curtida de um comentário, basta executar a ação de 'like' novamente, definindo-a como 'true', o mesmo vale para o "dislike".

```https
  POST https://projeto-labeddit-backend-88qh.onrender.com/comments/:id/like
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Authorization` | `key` | **Obrigatório**. A autorização do usuário |
| `id` | `Path Variables` | **Obrigatório**. O Id do comentário que receberá o like ou o dislike |

## Body:
Para dar like:
```json
{
    "like": true
}
```

para tirar o like:
```json
{
    "like": false
}
```
### Exemplo de resposta:

```json
{
  "message": "Comentário curtido com sucesso!"
}
```

ou
```json
{
  "message": "Comentário descurtido com sucesso!"
}
```

