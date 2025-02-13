# Desafio técnico - Learning Rocks

## Contexto

A Plataforma LXM da Learning Rocks é uma solução de educação corporativa desenvolvida para potencializar o aprendizado e a performance dos colaboradores dentro das empresas. Nosso modelo B2B atende organizações que desejam estruturar e gerenciar treinamentos obrigatórios, trilhas de conhecimento e capacitações personalizadas.

---

## Setup do projeto de backend

### Pré-requisitos

O que você precisa para configurar o projeto:

- [NPM](https://www.npmjs.com/)
- [Node](https://nodejs.org/en/) `>=22.0.0` (Instale usando [NVM](https://github.com/nvm-sh/nvm))
- [Docker Compose](https://docs.docker.com/compose/)

### Setup

1. **Instale o Docker e o Docker Compose**, caso ainda não tenha.
2. Suba os serviços necessários (PostgreSQL e Redis) com:
   ```bash
   docker-compose up -d
   ```
3. Instale as dependências do projeto:
   ```bash
   nvm use && npm install
   ```
4. Configure o banco de dados:
   ```bash
   npm run db:migrate && npm run db:seed
   ```

   Observação: certifique-se de que o arquivo `.env` está configurado corretamente, e que as credenciais de acesso ao banco de dados estão corretas,  de acordo com o que está configurado na sua maquina.

5. Inicie o servidor:
   ```bash
   npm run start:dev
   ```
6. Acesse o **Playground do GraphQL**:
   - 👉 [http://localhost:3000/graphql](http://localhost:3000/graphql)

### Tests

Para rodar os testes:

```bash
npm run test
```

### Migrations

Caso precise criar novas migrations, utilize o comando:

```bash
npm run db:create_migration --name=create-xpto-table
```
Pontos que foram abordados no projeto:

- [x] Refatoração da arquitetura do projeto,  para Clean Architecture:
  Motivos - Eu gosto da arquitetura modular do Nest, porém quando o projeto cresce, a arquitetura do Nest, pode se tornar um pouco confusa, com muitos módulos, e arquivos de services giantescos, e dificultar a manutenção, por isso optei por uma arquitetura mais limpa, e mais escalável no desenvolvimento dos testes.
- [x] Utilização de Design Patterns,  Factory Method, Strategy, Singleton, Repository, Service, DTO, Dependency Injection, para contribuir na abordagem de Criação de outros tipos de Conteúdo, de forma mais escalável.
- [x] Utilização de Testes Unitários e integração, para garantir a integridade do código cobertura de 90%.
- [x] Correção da Falha de Segurança na busca de conteúdo por ID, que permitia a busca de conteúdos de outras empresas que não a do usuário logado, resolvi isso ajustando a arquitetura multi-tenant, e peando o id da company no token de autenticação, e passando na query, dado esse resultado um item da lista, não vai ser encontrado.
- [x] Implementação de um novo formato de conteudo TXT, de forma muito simples, para exemplificar a escalabilidade da arquitetura,  adicionando um novo item no modelo da Factory e implementando os testes.
