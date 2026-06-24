CREATE TABLE relacao_cultura (
    id_relacao SERIAL PRIMARY KEY,
    tipo_relacao VARCHAR(20) NOT NULL CHECK (tipo_relacao IN ('RECOMENDADA', 'NAO_RECOMENDADA')),
    justificativa TEXT NOT NULL,
    link_referencia TEXT,
    ano_referencia INTEGER,
    observacao_consorcio TEXT,

    assinatura_culturas VARCHAR(100) UNIQUE NOT NULL,

    id_usuario INTEGER,

    CONSTRAINT fk_relacao_usuario
        FOREIGN KEY (id_usuario)
            REFERENCES usuario(id_usuario)
            ON DELETE SET NULL
);
