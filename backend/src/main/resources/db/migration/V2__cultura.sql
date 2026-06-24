CREATE TABLE cultura (
    id_cultura SERIAL PRIMARY KEY,
    nome_cultura VARCHAR(100) UNIQUE NOT NULL,
    tipo_cultura VARCHAR(20) NOT NULL CHECK (tipo_cultura IN ('FOLHAS', 'RAIZES', 'TUBERCULOS', 'BULBOS', 'FRUTOS', 'FLORES')),
    familia VARCHAR(50),
    tempo_estimado INTEGER,
    espaco_plantas INTEGER,
    espaco_linhas INTEGER,
    semente_cova INTEGER,
    demanda_nutricional TEXT,
    observacao_cultura TEXT,
    arquivo_foto TEXT NOT NULL,
    regiao_plantio VARCHAR(20) CHECK (regiao_plantio IN ('NORTE', 'NORDESTE', 'CENTRO_OESTE', 'SUDESTE', 'SUL')),

--     região norte
    mes_inicio_norte INTEGER CHECK (mes_inicio_norte BETWEEN 1 AND 12),
    mes_fim_norte INTEGER CHECK (mes_fim_norte BETWEEN 1 AND 12),
--     região nordeste
    mes_inicio_nordeste INTEGER CHECK (mes_inicio_nordeste BETWEEN 1 AND 12),
    mes_fim_nordeste INTEGER CHECK (mes_fim_nordeste BETWEEN 1 AND 12),
--     região centro-oeste
    mes_inicio_centro_oeste INTEGER CHECK (mes_inicio_centro_oeste BETWEEN 1 AND 12),
    mes_fim_centro_oeste INTEGER CHECK (mes_fim_centro_oeste BETWEEN 1 AND 12),
--     região sudeste
    mes_inicio_sudeste INTEGER CHECK (mes_inicio_sudeste BETWEEN 1 AND 12),
    mes_fim_sudeste INTEGER CHECK (mes_fim_sudeste BETWEEN 1 AND 12),
--     região sul
    mes_inicio_sul INTEGER CHECK (mes_inicio_sul BETWEEN 1 AND 12),
    mes_fim_sul INTEGER CHECK (mes_fim_sul BETWEEN 1 AND 12),

    id_usuario INTEGER,

    CONSTRAINT fk_cultura_usuario
        FOREIGN KEY (id_usuario)
            REFERENCES usuario(id_usuario)
            ON DELETE SET NULL
);
