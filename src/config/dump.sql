CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario UUID PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha CHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS produtos (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    preco NUMERIC(10, 2) NOT NULL,
    imagem TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    id_usuario UUID REFERENCES usuarios(id_usuario) NOT NULL,
    id_produto INT REFERENCES produtos(id_produto) NOT NULL,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);