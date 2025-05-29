CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE loads (
    id SERIAL PRIMARY KEY,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    eta TIMESTAMP
);

CREATE TABLE summaries (
    id SERIAL PRIMARY KEY,
    load_id INT REFERENCES loads(id) ON DELETE CASCADE,
    resumo TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loads_origin ON loads(origin);
CREATE INDEX idx_loads_destination ON loads(destination);
CREATE INDEX idx_summaries_load_id ON summaries(load_id);

CREATE MATERIALIZED VIEW loads_summaries AS
SELECT l.id, l.origin, l.destination, l.price, s.resumo, s.criado_em
FROM loads l
LEFT JOIN summaries s ON l.id = s.load_id;

CREATE MATERIALIZED VIEW loads_summaries AS
SELECT l.id, l.origin, l.destination, l.price, s.resumo, s.criado_em
FROM loads l
LEFT JOIN summaries s ON l.id = s.load_id;

REFRESH MATERIALIZED VIEW loads_summaries;