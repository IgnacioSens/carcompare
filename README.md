# CarCompare

Plataforma web de comparação de carros — explore, filtre e compare veículos lado a lado de forma inteligente.

## Stack

| Camada        | Tecnologia                        |
|---------------|-----------------------------------|
| Frontend      | React 18 + Vite + Tailwind CSS    |
| Backend       | Node.js + Express                 |
| Banco de dados| PostgreSQL (Supabase)             |
| Autenticação  | JWT + bcryptjs                    |
| Email         | Nodemailer + Gmail SMTP           |
| Infraestrutura| Docker + Docker Compose           |

## Funcionalidades

- Busca e filtragem de carros por marca, categoria e combustível
- Comparação lado a lado com destaque do vencedor por campo
- Especificações técnicas: potência, torque, 0–100 km/h, vel. máxima, motor e consumo
- Favoritos salvos no banco de dados por usuário
- Sistema de cadastro e login com JWT
- Email de boas-vindas automático ao cadastrar
- Formulário de contato com envio por email
- Interface responsiva para mobile e desktop

## Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com) com as tabelas criadas

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/rafuulll/carcompare.git
cd carcompare

# 2. Configure o backend
cd backend
cp .env.example .env
# Preencha as variáveis no arquivo .env

# 3. Instale as dependências e rode o backend
npm install
npm run dev

# 4. Em outro terminal, rode o frontend
cd ../frontend
npm install
npm run dev

# 5. Acesse
# Frontend: http://localhost:5173
# Backend:  http://localhost:3001/api/health
```

### Variáveis de ambiente (`backend/.env`)

```env
PORT=3001

# Banco de dados (Supabase)
DB_HOST=seu-host.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.seu-projeto
DB_PASSWORD=sua-senha

# JWT
JWT_SECRET=seu_segredo_aqui

# Email (Gmail com App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=sua-app-password
EMAIL_DESTINO=email-que-recebe-contato@gmail.com
```

## Estrutura do projeto

```
carcompare/
├── frontend/        # React + Vite
│   └── src/
│       ├── pages/          # Home, Catálogo, Detalhe, Comparar, Favoritos...
│       ├── components/     # UI (Button, Card, Input...) e Layout (Navbar, Footer)
│       └── services/       # Axios com interceptor JWT
├── backend/         # Node.js + Express
│   └── src/
│       ├── routes/         # auth, carros, favoritos, contato
│       ├── controllers/    # lógica de cada rota
│       ├── middlewares/    # autenticação JWT
│       ├── services/       # envio de email
│       └── config/         # conexão com banco de dados
├── docker-compose.yml
├── .env.example
└── README.md
```

## Rodando com Docker

```bash
# Copie o .env de exemplo e preencha
cp .env.example .env

# Suba os containers
docker compose up --build

# Frontend: http://localhost:5173
# Backend:  http://localhost:3001/api/health
```
