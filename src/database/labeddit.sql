-- Active: 1692279374359@@127.0.0.1@1433
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

INSERT INTO users (id, name, email, password, role)
VALUES
     -- tipo NORMAL e senha = fulano123
    ('u001', 'Fulano','fulano@email.com', '$2a$12$qPQj5Lm1dQK2auALLTC0dOWedtr/Th.aSFf3.pdK5jCmYelFrYadC', 'NORMAL'),
     -- tipo NORMAL e senha = beltrana00
    ('u002', 'Beltrana', 'beltrana@email.com', '$2a$12$403HVkfVSUbDioyciv9IC.oBlgMqudbnQL8ubebJIXScNs8E3jYe2', 'NORMAL'),
      -- tipo ADMIN e senha = astrodev99
    ('u003', 'Astrodev','astrodev@email.com', '$2a$12$lHyD.hKs3JDGu2nIbBrxYujrnfIX5RW5oq/B41HCKf7TSaq9RgqJ.', 'ADMIN');

CREATE TABLE posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT (0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    comments_post INTEGER DEFAULT (0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

INSERT INTO posts (id, creator_id, content)
VALUES
    ('p001', 'u001', 'Este é o primeiro post de Fulano.'),
    ('p002', 'u002', 'Mais um dia ensolarado.'),
    ('p003', 'u001', 'Astrodev sempre trazendo conteúdo de qualidade.');

CREATE TABLE post_likes_dislikes (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

INSERT INTO post_likes_dislikes (user_id, post_id, like)
VALUES
    ('u002', 'p001', 1),
    ('u003', 'p001', 1),
    ('u001', 'p002', 1),
    ('u003', 'p002', 0),
    ('u001', 'p003', 1);

CREATE TABLE comments (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    post_id TEXT NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT (0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

INSERT INTO comments (id, post_id, creator_id, content)
VALUES
    ('c001', 'p001', 'u003', 'Ótimo post! Concordo com tudo.'),
    ('c002', 'p001', 'u002', 'Não poderia estar mais de acordo.'),
    ('c003', 'p002', 'u001', 'Belas palavras, Fulano.'),
    ('c004', 'p003', 'u003', 'Isso mesmo, Astrodev!');

CREATE TABLE comment_likes_dislikes (
    user_id TEXT NOT NULL,
    comments_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (comments_id) REFERENCES comments(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

INSERT INTO comment_likes_dislikes (user_id, comments_id, like)
VALUES
    ('u001', 'c001', 1),
    ('u002', 'c001', 1),
    ('u003', 'c002', 1),
    ('u001', 'c003', 0);

