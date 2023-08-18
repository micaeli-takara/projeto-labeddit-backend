-- Active: 1692279374359@@127.0.0.1@1433
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    surname TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

INSERT INTO users (id, name, surname, email, password, role)
VALUES
    ('u001', 'Fulano', 'FulanoDeTal','fulano@email.com', '$2a$12$qPQj5Lm1dQK2auALLTC0dOWedtr/Th.aSFf3.pdK5jCmYelFrYadC', 'NORMAL'),
    ('u002', 'Beltrana', 'BeltranaLinda','beltrana@email.com', '$2a$12$403HVkfVSUbDioyciv9IC.oBlgMqudbnQL8ubebJIXScNs8E3jYe2', 'NORMAL'),
    ('u003', 'Astrodev', 'Astrodev1990','astrodev@email.com', '$2a$12$lHyD.hKs3JDGu2nIbBrxYujrnfIX5RW5oq/B41HCKf7TSaq9RgqJ.', 'ADMIN');

CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT (0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
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

INSERT INTO post_likes_dislikes (user_id, post_id, like_status) -- O nome correto deve ser 'like', não 'like_status'
VALUES
    ('u002', 'p001', 1),
    ('u003', 'p001', 1),
    ('u001', 'p002', 1),
    ('u003', 'p002', 0),
    ('u001', 'p003', 1);

CREATE TABLE comments (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    post_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT (0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

INSERT INTO comments (id, post_id, user_id, content)
VALUES
    ('c001', 'p001', 'u003', 'Ótimo post! Concordo com tudo.'),
    ('c002', 'p001', 'u002', 'Não poderia estar mais de acordo.'),
    ('c003', 'p002', 'u001', 'Belas palavras, Fulano.'),
    ('c004', 'p003', 'u003', 'Isso mesmo, Astrodev!');

CREATE TABLE comment_likes_dislikes (
    user_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

INSERT INTO comment_likes_dislikes (user_id, comment_id, like)
VALUES
    ('u001', 'c001', 1),
    ('u002', 'c001', 1),
    ('u003', 'c002', 1),
    ('u001', 'c003', 0);
