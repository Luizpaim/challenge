# 🎬 Desafio Frontend - Player de Conteúdos

## 🚀 Contexto

Nosso backend provisiona diferentes tipos de conteúdos (`vídeo`, `imagem`, `PDF` e `link`), e agora queremos construir uma interface para exibir esses conteúdos aos usuários.

## 🎯 Desafio

Seu desafio será **desenvolver um player interativo** que permita visualizar e navegar entre os conteúdos.

Você deverá criar uma `única tela` em **Nuxt 2 + Vue 2** que:

1. **Consuma os dados do backend** usando GraphQL.
2. **Liste os conteúdos disponíveis** e permita a navegação entre eles.
3. **Reproduza os conteúdos** de acordo com o seu tipo.
4. **Exiba um progresso total do usuário** (pode ser um valor estático para simular que o usuário está tendo progresso nos conteúdos).
5. **Responsividade** para a aplicação se adaptar bem a diferentes tamanhos de tela.
6. **Implemente testes unitários** para garantir a estabilidade da aplicação.

Fique a vontade para usar qualquer AI que te ajude no desenvolvimento 🤖.

## 🔗 Integração com o Backend

1️⃣ Clone o repositório do backend: https://github.com/skore-io/challenge

2️⃣ Faça o setup do projeto na sua máquina seguindo as instruções do [README](./README.md)

3️⃣ Utilize a seguinte query GraphQL para obter os dados do conteúdo:

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMThjMzdjZTItY2QzNC00MzA1LTljYTQtYzE1ZmM3MzZiZWFjIn0.pqWRiyQuvWRVQgIzKvQ85RrBwSF5KxeGZrkFvKt2CG8" \
  -d '{
    "query": "
      query {
        provision(content_id: \"4372ebd1-2ee8-4501-9ed5-549df46d0eb0\") {
          id
          title
          description
          url
          created_at
          allow_download
          is_embeddable
          format
          bytes
          metadata
        }
      }"
  }'
```

- Substitua apenas o `content_id` pelo conteúdo que será aberto no player;
- O token do Authorization está correto e funciona no backend.
- Para acessar o playground do graphql (com o backend rodando): [http://localhost:3000/graphql](http://localhost:3000/graphql)

Além disso, use a seguinte lista hardcoded de conteúdos para a listagem (todos os dados existem no database local do backend):

```json
[
  {
    "id": "4372ebd1-2ee8-4501-9ed5-549df46d0eb0",
    "title": "Introdução à Cultura Tech",
    "description": "Uma imagem ilustrativa sobre a cultura de trabalho em equipe.",
    "url": "http://localhost:3000/uploads/image1.jpg",
    "total_likes": 0,
    "type": "image",
    "cover": "http://localhost:3000/uploads/image1-cover.jpg",
    "company_id": "5e444e9c-66a9-4004-bde5-db5e614e5c34",
    "created_at": "2025-02-03T22:41:50.798Z"
  },
  {
    "id": "26a42e72-cc93-44b3-acae-01537a36322b",
    "title": "Ambiente de Trabalho Moderno",
    "description": "Uma imagem representando espaços colaborativos e inovação nas empresas de tecnologia.",
    "url": "http://localhost:3000/uploads/image2.png",
    "total_likes": 2,
    "type": "image",
    "cover": "http://localhost:3000/uploads/image2-cover.jpg",
    "company_id": "5e444e9c-66a9-4004-bde5-db5e614e5c34",
    "created_at": "2025-02-03T22:41:50.798Z"
  },
  {
    "id": "7acff1c5-4c43-4923-a323-d22a12573041",
    "title": "Guia de Boas Práticas em Desenvolvimento",
    "description": "Um documento detalhado sobre boas práticas de programação e metodologias ágeis.",
    "url": "http://localhost:3000/uploads/pdf1.pdf",
    "total_likes": 4,
    "type": "pdf",
    "cover": "http://localhost:3000/uploads/pdf1-cover.jpg",
    "company_id": "5e444e9c-66a9-4004-bde5-db5e614e5c34",
    "created_at": "2025-02-03T22:41:50.798Z"
  },
  {
    "id": "3a5a94aa-17da-4e9a-b493-fe7e81294631",
    "title": "Manual de Arquitetura de Software",
    "description": "Um manual técnico abordando padrões arquiteturais e boas práticas para sistemas escaláveis.",
    "url": "http://localhost:3000/uploads/pdf2.pdf",
    "total_likes": 6,
    "type": "pdf",
    "cover": "http://localhost:3000/uploads/pdf2-cover.jpg",
    "company_id": "c86b4e57-23d8-48f3-9f1d-d9325e5a2ccd",
    "created_at": "2025-02-03T22:41:50.798Z"
  },
  {
    "id": "6969d6c7-40ea-4a3c-b635-d6546b971304",
    "title": "Plataforma de Aprendizado Online",
    "description": "Acesse este link para cursos e treinamentos voltados para tecnologia e inovação.",
    "url": "https://learning.rocks",
    "total_likes": 8,
    "type": "link",
    "cover": null,
    "company_id": "5e444e9c-66a9-4004-bde5-db5e614e5c34",
    "created_at": "2025-02-03T22:41:50.798Z"
  },
  {
    "id": "d060ab17-c961-4de7-929f-a0d52aa3ecf4",
    "title": "Inteligência artificial",
    "description": null,
    "url": "http://localhost:3000/uploads/video1.mp4",
    "total_likes": 10,
    "type": "video",
    "cover": "http://localhost:3000/uploads/video1-cover.jpg",
    "company_id": "5e444e9c-66a9-4004-bde5-db5e614e5c34",
    "created_at": "2025-02-03T22:41:50.798Z"
  }
]
```

## 🎨 Inspiração de Layout

Aqui estão algumas referências para te inspirar e ajudar a estruturar a interface:

1️⃣
![alt text](static/player-page1.png)

2️⃣
![alt text](static/player-page2.png)

3️⃣
![alt text](static/player-page3.png)

---

## 📩 Como enviar o desafio

Após concluir o desafio, siga as instruções abaixo para enviá-lo corretamente:

Crie um repositório no GitHub (público ou privado).

Caso seja privado, adicione os usuários avaliadores (solicite ao recrutador) como colaborador para que possamos revisar.

Certifique-se de incluir um README.md explicando como rodar a aplicação, decisões técnicas e melhorias feitas.

Envie o link do repositório no canal de comunicação informado pelo recrutador.

Se houver alguma consideração adicional, documente no README.

🔍 O que será avaliado?

✅ **Funcionalidade** – O player de conteúdos, a navegação e o progresso estão funcionando corretamente?

✅ **Qualidade do código** – O código está organizado, reutilizável e fácil de manter?

✅ **Responsividade** – A interface se adapta bem a diferentes dispositivos?

✅ **Testes** – Testes unitários foram implementados corretamente?

✅ **Documentação** – O README do seu projeto tem todas as informações necessárias para executar o projeto de forma fácil?

Se tiver dúvidas sobre o envio, entre em contato! 🚀

🔥 **Boa sorte no desafio!**
