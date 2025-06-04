import { Transfer, TransferRequest } from '../entities/Transfer';

export interface TransferRepository {
  create(transfer: Transfer): Promise<Transfer>;
  findById(transferId: string): Promise<Transfer | null>;
  findByUserId(userId: string): Promise<Transfer[]>;
}