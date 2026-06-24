CREATE TABLE cultura_associada (
    id_cultura_associada SERIAL PRIMARY KEY,
    id_relacao INT NOT NULL,
    id_cultura INT NOT NULL,

    FOREIGN KEY (id_relacao)
        REFERENCES relacao_cultura(id_relacao)
        ON DELETE CASCADE,

    FOREIGN KEY (id_cultura)
        REFERENCES cultura(id_cultura)
        ON DELETE CASCADE,

    UNIQUE (id_relacao, id_cultura)
);
