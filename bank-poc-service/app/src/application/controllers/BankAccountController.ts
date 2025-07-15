import { Request, Response } from 'express';
import { BankAccountRepository } from '../../domain/repositories/BankAccountRepository';
import { BankAccountService } from '../../domain/services/BankAccountService';
export class BankAccountController {
  constructor(private bankAccountService: BankAccountService) {}

  async createAccount(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.headers['user-id'] as string;
      if (!userId) {
        res.status(400).json({ error: 'User ID header is required' });
        return ;
      }

      const account = await this.bankAccountService.create(userId, req.body);
      res.status(201).json(account);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAccount(req: Request, res: Response): Promise<void> {
    try {
      const account = await this.bankAccountService.findById(req.params.id);
      if (!account) {
        res.status(404).json({ error: 'Account not found' });
        return;
      }
      res.json(account);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getUserAccounts(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const accounts = await this.bankAccountService.findByUserId(userId);
      res.json(accounts);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAllAccounts(req: Request, res: Response): Promise<void> {
    try {
      const accounts = await this.bankAccountService.findAll();
      res.json(accounts);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateAccount(req: Request, res: Response): Promise<void> {
    try {
      const account = await this.bankAccountService.update(req.params.id, req.body);
      if (!account) {
        res.status(404).json({ error: 'Account not found' });
        return;
      }
      res.json(account);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async deleteAccount(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.bankAccountService.delete(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Account not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }


  async getBalance(req: Request, res: Response): Promise<void> {
    try {
      const account = await this.bankAccountService.findById(req.params.id);
      if (!account) {
        res.status(404).json({ error: 'Account not found' });
        return;
      }
      res.json({
        balance : account.balance
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async currencyConversion (req : Request, res : Response) : Promise<void> {
    try {
      console.log('req',req.body)
      const account = await this.bankAccountService.convertCurrerncy(req.params.id, req.body.amount);

      if (!account) {
        res.status(404).json({ error: 'Account not found' });
        return;
      }
      res.status(200).json(account);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

}