import { Transfer } from '../../domain/entities/Transfer';
import { TransferRepository } from '../../domain/repositories/TransferRepository';

export class InMemoryTransferRepository implements TransferRepository {
  private transfers: Map<string, Transfer> = new Map();

  async create(transfer: Transfer): Promise<Transfer> {
    this.transfers.set(transfer.transfer_id, transfer);
    return transfer;
  }

  async findById(transferId: string): Promise<Transfer | null> {
    return this.transfers.get(transferId) || null;
  }

  async findByUserId(userId: string): Promise<Transfer[]> {
    return Array.from(this.transfers.values()).filter(transfer => transfer.user_id === userId);
  }
}