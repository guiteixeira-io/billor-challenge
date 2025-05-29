-- Criação da tabela de motoristas
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,           -- Identificador único do motorista
    name VARCHAR(255) NOT NULL       -- Nome do motorista
);

-- Criação da tabela de cargas
CREATE TABLE loads (
    id SERIAL PRIMARY KEY,           -- Identificador único da carga
    origin VARCHAR(255) NOT NULL,    -- Origem da carga
    destination VARCHAR(255) NOT NULL,-- Destino da carga
    price DECIMAL(10,2) NOT NULL,    -- Preço da carga
    eta TIMESTAMP                    -- Previsão de chegada
);

-- Criação da tabela de resumos das cargas
CREATE TABLE summaries (
    id SERIAL PRIMARY KEY,           -- Identificador único do resumo
    load_id INT REFERENCES loads(id) ON DELETE CASCADE, -- FK para a carga, exclui resumo se carga for removida
    resumo TEXT NOT NULL,            -- Texto do resumo gerado
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Data/hora de criação do resumo
);

-- Índices para otimizar buscas por origem, destino e relação com summaries
CREATE INDEX idx_loads_origin ON loads(origin);
CREATE INDEX idx_loads_destination ON loads(destination);
CREATE INDEX idx_summaries_load_id ON summaries(load_id);

-- Criação de uma materialized view para facilitar consultas agregadas de cargas e resumos
CREATE MATERIALIZED VIEW loads_summaries AS
SELECT l.id, l.origin, l.destination, l.price, s.resumo, s.criado_em
FROM loads l
LEFT JOIN summaries s ON l.id = s.load_id;

-- Atualiza a materialized view para refletir os dados mais recentes
REFRESH MATERIALIZED VIEW loads_summaries;