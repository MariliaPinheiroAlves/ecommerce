# About

Este é o backend da aplicação final do Módulo Avançado de Express da Ada Tech. Durante este módulo, 
enfrentamos o desafio de criar uma API para e-commerce e integrá-la eficientemente com o 
frontend da aplicação.

# Getting started

Este projeto possui variáveis de ambiente definidas para Banco de Dados e Portas, 
se necessário altere o arquivo `.env` para corresponder com suas configurações locais.

É essencial ter o banco de dados PostgreSQL instalado e configurado. 
Siga os passos abaixo para realizar a instalação e configuração adequadas:

1. Ter o postgres instalado.

2. Criar o database ecommerce.

3. Rode o script para a criação das tabelas que está no caminho `./src/config/dump.sql`.

## Run

```shell
# 1. Clone o projeto

git clone https://github.com/MariliaPinheiroAlves/ecommerce

cd ecommerce

# 2. Instale as dependências

npm install

# 3. Execute a aplicação

npm run dev
```