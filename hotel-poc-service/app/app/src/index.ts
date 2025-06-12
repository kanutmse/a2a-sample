import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createRoutes } from './infrastructure/web/routes';
import { UserController } from './application/controllers/UserController';
import { BankAccountController } from './application/controllers/BankAccountController';
import { TransferController } from './application/controllers/TransferController';
import { InMemoryUserRepository } from './infrastructure/repositories/InMemoryUserRepository';
import { InMemoryBankAccountRepository } from './infrastructure/repositories/InMemoryBankAccountRepository';
import { InMemoryTransferRepository } from './infrastructure/repositories/InMemoryTransferRepository';
import { TransferService } from './domain/services/TransferService';
import { UserService } from './domain/services/UserService';
import { BankAccountService } from './domain/services/BankAccountService';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize repositories
const userRepository = new InMemoryUserRepository();
const bankAccountRepository = new InMemoryBankAccountRepository();
const transferRepository = new InMemoryTransferRepository();

// Initialize services
const userService = new UserService(userRepository)
const bankAccountService = new BankAccountService(bankAccountRepository)
const transferService = new TransferService(bankAccountService, transferRepository);

// Initialize controllers
const userController = new UserController(userService);
const bankAccountController = new BankAccountController(bankAccountService);
const transferController = new TransferController(transferService);

// Routes
app.use('/api', createRoutes(userController, bankAccountController, transferController));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Mobile Banking Service running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`📖 API Base URL: http://localhost:${PORT}/api`);
});

export default app;