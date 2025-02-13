# 🎬 Desafio Backend - Provisionador de Conteúdos

## 🚀 Contexto

No fim do ano, iniciamos o desenvolvimento do **provisionador de conteúdos** para servir os players. Devido ao prazo apertado, conseguimos entregar apenas os quatro primeiros tipos de conteúdo: `vídeo`, `imagem`, `PDF` e `link`.

Sabemos que essa foi apenas a primeira versão, e que ela **não está otimizada para o crescimento esperado**. Nosso objetivo é expandir esse provisionador para suportar **20 tipos de conteúdo** ao longo das próximas semanas.

## 🎯 Desafio

Agora chegou a sua vez de contribuir!

Nosso código precisa de melhorias antes que possamos continuar expandindo. Seu desafio será atuar em **três frentes principais**:

🔹 **Escalabilidade**

O provisionador atual não foi projetado para crescer e precisa ser refatorado para suportar novos formatos de conteúdo de forma eficiente.

📝 Refatore o código para torná-lo mais flexível e sustentável, garantindo que futuras implementações sejam mais simples e organizadas.

🔹 **Segurança**

Após o lançamento, identificamos uma **falha crítica de segurança** que pode comprometer o sistema.

📝 Encontre e corrija essa vulnerabilidade, garantindo a integridade da aplicação.

🔹 **Evolução**

Conteúdo do tipo texto é um dos formatos de conteúdo mais requisitado pelos clientes, mas ainda não está implementado.

📝 Adicione suporte ao provisionamento de `texto`.

Fique a vontade para usar qualquer AI que te ajude no desenvolvimento 🤖.

## 🛠 Informações técnicas

- Para configurar o projeto siga as instruções do [README](./README.md)
- O projeto segue uma **arquitetura multitenancy**, onde os recursos são **compartilhados entre empresas**, mas **separados logicamente** para garantir segurança e evitar que um cliente tenha acesso aos dados de outro.
- Para chamar a query `provision`, utilize o header de autorização:

```bash
Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMThjMzdjZTItY2QzNC00MzA1LTljYTQtYzE1ZmM3MzZiZWFjIn0.pqWRiyQuvWRVQgIzKvQ85RrBwSF5KxeGZrkFvKt2CG8"
```

## 🎁 Bônus

Quer ganhar alguns pontos extras? 🚀

**Escreva testes de integração** para garantir que o provisionador funcione corretamente.

---

## 📩 Como enviar o desafio

Após concluir o desafio, siga as instruções abaixo para enviá-lo corretamente:

1. **Faça um fork deste repositório no GitHub.**

   - Isso permitirá que você trabalhe diretamente sobre o código existente.

2. **Implemente as mudanças solicitadas** diretamente no fork.

   - Certifique-se de incluir um **README.md** atualizado, explicando como rodar a aplicação, decisões técnicas e melhorias feitas.

3. **Envie o link do repositório e do PR no canal de comunicação informado pelo recrutador.**
   - Caso o repositório seja privado, adicione os usuários avaliadores (solicite ao recrutador) como colaboradores para que possamos revisar.
   - Se houver alguma consideração adicional, documente no README ou na descrição do PR.

### 🔍 O que será avaliado?

✅ **Funcionalidade** – O provisionador de conteúdos está funcionando corretamente?

✅ **Qualidade do Código** – O código está organizado, reutilizável e fácil de manter?

✅ **Escalabilidade** – O sistema suporta novos tipos de conteúdos facilmente?

✅ **Segurança** – A falha crítica foi corrigida?

✅ **Testes** – Testes unitários (e/ou de integração) foram implementados corretamente?

✅ **Documentação** – O README do seu projeto tem todas as informações necessárias para executar o projeto de forma fácil?

Se tiver dúvidas sobre o envio, entre em contato! 🚀

🔥 **Boa sorte no desafio!**
