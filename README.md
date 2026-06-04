# ShaveUp - Backend (Plataforma de Agendamento e Gestão de Barbearia)

Este repositório contém a API do **ShaveUp**, uma plataforma de agendamento e gerenciamento para barbearias, desenvolvida com o framework [NestJS](https://github.com/nestjs/nest) em TypeScript, utilizando [Prisma ORM](https://www.prisma.io/) e [PostgreSQL](https://www.postgresql.org/).

---

## 🛠️ Tecnologias e Arquitetura

O backend foi arquitetado seguindo princípios de modularidade e injeção de dependências do NestJS:
- **Core**: [NestJS](https://nestjs.com/) para o roteamento, injeção de dependências e gerenciamento de ciclo de vida.
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/) gerenciado pelo [Prisma ORM](https://www.prisma.io/).
- **Segurança**:
  - Hash de senhas com [bcrypt](https://www.npmjs.com/package/bcrypt).
  - Autenticação e autorização via tokens JWT com Guards baseados em papéis de usuário (Roles).
- **Validação**: [class-validator](https://github.com/typestack/class-validator) e [class-transformer](https://github.com/typestack/class-transformer) para validação estrita de dados de entrada (DTOs).

---

## 🔄 Fluxos da Plataforma

A aplicação divide-se em três grandes módulos de negócio:

### 1. Autenticação e Registro (`Auth`)
- **Cadastro de Usuários**: Permite que novos clientes se cadastrem fornecendo nome, e-mail e senha. Por padrão, novos cadastros são associados à role `Cliente`.
- **Autenticação (Login)**: Valida credenciais e gera um token JWT contendo o ID e a Role do usuário para autorizar chamadas futuras às rotas protegidas.

### 2. Fluxo do Cliente (`Customer`)
- **Horários Disponíveis**: Consulta horários vagos nos próximos 7 dias úteis, considerando o expediente da barbearia e a agenda individual de cada barbeiro.
- **Agendamento**: Permite que o cliente reserve um horário com um barbeiro específico.
- **Histórico de Agendamentos**: Lista todos os agendamentos realizados pelo cliente nos últimos 12 meses, ordenados por data decrescente.
- **Cancelamento**: Permite ao cliente cancelar um agendamento futuro sob as seguintes regras rígidas:
  - O agendamento deve estar com status **Pendente** ou **Aprovado**.
  - O cancelamento deve ser feito com no mínimo **24 horas de antecedência** do horário agendado (validação baseada em milissegundos para evitar problemas com fusos horários e quebras de mês/ano).

### 3. Fluxo Administrativo / Barbeiro (`Admin`)
- **Gestão de Usuários**: Permite listar os usuários cadastrados e elevar clientes ao papel de `Barbeiro`.
- **Gestão de Agendamentos**:
  - Listar a agenda semanal completa de um barbeiro específico a partir de uma data de referência.
  - Atualizar o status de um agendamento (Aprovar, Rejeitar, Concluir, marcar Falta/Não Compareceu, etc.).

---

## ⚙️ Configuração do Ambiente e Execução

Siga o passo a passo abaixo para colocar a plataforma em execução localmente.

### Pré-requisitos
- [Node.js](https://nodejs.org/) (Versão recomendada: `22.13.x`)
- [PNPM](https://pnpm.io/) (Versão recomendada: `10.30.x`)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

---

### Passo 1: Clonar e Configurar as Variáveis de Ambiente
Navegue até a pasta do backend:
```bash
cd backend
```

Copie o arquivo de exemplo de variáveis de ambiente para criar o seu `.env`:
```bash
pnpm run load-env
```
*(Ou copie manualmente o `.env.example` para `.env`)*

Ajuste as credenciais do banco de dados e a chave secreta do JWT (`JWT_SECRET`) se necessário.

---

### Passo 2: Subir os Serviços Auxiliares (PostgreSQL e Redis)
A aplicação necessita do PostgreSQL e do Redis rodando. Suba-os em segundo plano utilizando o Docker Compose:
```bash
docker compose up -d
```

---

### Passo 3: Instalar as Dependências
Execute o instalador do pnpm:
```bash
pnpm install
```

---

### Passo 4: Executar as Migrações e Gerar o Prisma Client
Gere os tipos do Prisma Client com base no esquema:
```bash
pnpm prisma:generate
```

Rode as migrações para criar as tabelas no banco de dados PostgreSQL:
```bash
pnpm prisma:migrate:dev
```

---

### Passo 5: Popular o Banco de Dados (Seed)
Popule o banco de dados com os registros essenciais (status de agendamento, tipos de usuários e contas de teste para clientes e barbeiros):
```bash
pnpm db:seed:dev
```

---

### Passo 6: Iniciar o Servidor de Desenvolvimento
Inicie a aplicação NestJS em modo watch (recarregamento automático ao salvar alterações):
```bash
pnpm run start:dev
```

O servidor backend estará ouvindo na porta configurada nas variáveis de ambiente (padrão: `http://localhost:8080`).

---

## 🧪 Execução de Testes
Para garantir que as regras de negócio e validações (como a de cancelamento e de horários disponíveis) funcionem perfeitamente, execute as suítes de testes:

```bash
# Executa todos os testes unitários (Jest)
pnpm run test

# Executa os testes em modo watch
pnpm run test:watch

# Gera a cobertura de testes
pnpm run test:cov
```

---

## 💻 Frontend (Como rodar)
Se desejar rodar a interface web Next.js do projeto:
1. Abra um terminal na pasta raiz e navegue até a pasta `frontend`:
   ```bash
   cd ../frontend
   ```
2. Instale as dependências:
   ```bash
   pnpm install
   ```
3. Crie um arquivo `.env.local` contendo a URL do backend:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   ```
4. Inicie o servidor de desenvolvimento do Next.js:
   ```bash
   pnpm dev
   ```
5. Acesse no navegador em `http://localhost:3000`.
