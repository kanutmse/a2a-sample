import { Request, Response } from 'express';
import { TransferService } from '../../domain/services/TransferService';
import { TransferRepository } from '../../domain/repositories/TransferRepository';

export class TransferController {
  constructor(
    private transferService: TransferService,
  ) {}

  async executeTransfer(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.headers['user-id'] as string;
      if (!userId) {
        res.status(400).json({ error: 'User ID header is required' });
        return;
      }

      const transfer = await this.transferService.executeTransfer(userId, req.body);
      res.status(201).json(transfer);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getTransfer(req: Request, res: Response): Promise<void> {
    try {
      const transfer = await this.transferService.findById(req.params.id);
      if (!transfer) {
        res.status(404).json({ error: 'Transfer not found' });
        return;
      }
      res.json(transfer);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getUserTransfers(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const transfers = await this.transferService.findByUserId(userId);
      res.json(transfers);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}