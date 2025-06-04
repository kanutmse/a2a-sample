# Mobile Banking Backend Service

A mock mobile banking backend service built with Node.js, TypeScript, and Domain-Driven Design principles.

## Features

- **User Management**: Complete CRUD operations for user accounts
- **Bank Account Management**: Full lifecycle management of bank accounts
- **Money Transfers**: Secure transfer functionality between accounts
- **In-Memory Storage**: No external dependencies required
- **Domain-Driven Design**: Clean architecture with proper separation of concerns
- **Docker Support**: Ready for containerized deployment

## API Endpoints

### Users
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Bank Accounts
- `POST /api/accounts` - Create account (requires `user-id` header)
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get account by ID
- `GET /api/users/:userId/accounts` - Get user's accounts
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Transfers
- `POST /api/transfers` - Execute transfer (requires `user-id` header)
- `GET /api/transfers/:id` - Get transfer by ID
- `GET /api/users/:userId/transfers` - Get user's transfers

## Request Examples

### Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1990-01-01"
  }'
```

### Create Bank Account
```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -H "user-id: YOUR_USER_ID" \
  -d '{
    "account_type": "SAVINGS",
    "initial_balance": 1000,
    "bank_name": "Mock Bank",
    "prompt_pay_number": "0123456789"
  }'
```

### Execute Transfer
```bash
curl -X POST http://localhost:3000/api/transfers \
  -H "Content-Type: application/json" \
  -H "user-id: YOUR_USER_ID" \
  -d '{
    "source_account_id": "SOURCE_ACCOUNT_ID",
    "to_account_id": "DESTINATION_ACCOUNT_ID",
    "amount": 100
  }'
```

## Running the Service

### Local Development
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build and run production
npm run build
npm start
```

### Docker
```bash
# Build and run with Docker
docker build -t mobile-banking-service .
docker run -p 3000:3000 mobile-banking-service

# Or use Docker Compose
docker-compose up --build
```

## Architecture

The service follows Domain-Driven Design principles:

- **Domain Layer**: Contains business entities, repositories interfaces, and domain services
- **Application Layer**: Contains controllers and application-specific logic
- **Infrastructure Layer**: Contains concrete implementations (in-memory repositories, web routing)

### Key Components

- **Entities**: User, BankAccount, Transfer
- **Repositories**: Abstract interfaces for data access
- **Services**: Business logic (TransferService)
- **Controllers**: HTTP request handlers
- **In-Memory Storage**: Simple Map-based storage for demonstration

## Security Features

- Account ownership validation for transfers
- Balance validation before transfers
- Header-based user authentication
- Input validation and error handling

## Health Check

The service includes a health check endpoint at `/health` that returns the service status and timestamp.

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode