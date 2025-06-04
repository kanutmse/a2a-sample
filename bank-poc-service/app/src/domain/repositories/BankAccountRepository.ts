import { BankAccount, CreateBankAccountRequest, UpdateBankAccountRequest } from '../entities/BankAccount';

export interface BankAccountRepository {
  create(userId: string, accountData: CreateBankAccountRequest): Promise<BankAccount>;
  findById(accountId: string): Promise<BankAccount | null>;
  findByUserId(userId: string): Promise<BankAccount[]>;
  findAll(): Promise<BankAccount[]>;
  update(accountData: BankAccount): Promise<BankAccount | null>;
  delete(accountId: string): Promise<boolean>;
}