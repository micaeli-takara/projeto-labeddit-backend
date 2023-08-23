import { BaseDatabase } from '../../src/database/BaseDatabase'
import { PostDB } from '../../src/models/Posts'

const postMock: PostDB[] = [
 {
    id: 'post-id-1',
    creator_id: 'user-id-1',
    content: 'Este é o conteúdo do primeiro post.',
    likes: 10,
    dislikes: 2,
    comments_post: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'post-id-2',
    creator_id: 'user-id-2',
    content: 'Este é o conteúdo do segundo post.',
    likes: 20,
    dislikes: 1,
    comments_post: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export class PostDatabaseMock extends BaseDatabase {

  public getPosts = async (): Promise<PostDB[]> => {
    return postMock
  }
}   