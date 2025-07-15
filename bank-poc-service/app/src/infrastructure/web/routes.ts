import { Router } from 'express';
import { UserController } from '../../application/controllers/UserController';
import { BankAccountController } from '../../application/controllers/BankAccountController';
import { TransferController } from '../../application/controllers/TransferController';

export function createRoutes(
  userController: UserController,
  bankAccountController: BankAccountController,
  transferController: TransferController
): Router {
  const router = Router();

  // User routes
  router.post('/users', (req, res) => userController.createUser(req, res));
  router.get('/users/search',(req,res)=> userController.getUsersByName(req,res))
  router.get('/users/:id', (req, res) => userController.getUser(req, res));
  router.get('/users', (req, res) => userController.getAllUsers(req, res));
  router.put('/users/:id', (req, res) => userController.updateUser(req, res));
  router.delete('/users/:id', (req, res) => userController.deleteUser(req, res));
''
  // Bank Account routes
  router.post('/accounts', (req, res) => bankAccountController.createAccount(req, res));
  router.get('/accounts/:id', (req, res) => bankAccountController.getAccount(req, res));
  router.get('/accounts', (req, res) => bankAccountController.getAllAccounts(req, res));
  router.get('/users/:userId/accounts', (req, res) => bankAccountController.getUserAccounts(req, res));
  router.put('/accounts/:id', (req, res) => bankAccountController.updateAccount(req, res));
  router.delete('/accounts/:id', (req, res) => bankAccountController.deleteAccount(req, res));

  router.post('/accounts/:id/convert', (req, res) => bankAccountController.currencyConversion(req, res));


  // Balance Route

  router.get('/accounts/:id/balances', (req, res) => bankAccountController.getAccount(req, res));

  // Transfer routes
  router.post('/transfers', (req, res) => transferController.executeTransfer(req, res));
  router.get('/transfers/:id', (req, res) => transferController.getTransfer(req, res));
  router.get('/users/:userId/transfers', (req, res) => transferController.getUserTransfers(req, res));

  return router;
}