CREATE TABLE sentiment_records (
    id BIGSERIAL PRIMARY KEY,
    text TEXT,
    prediction VARCHAR(50),
    probability DOUBLE PRECISION,
    created_at TIMESTAMP
);
