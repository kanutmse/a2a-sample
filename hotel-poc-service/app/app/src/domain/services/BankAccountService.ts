import { BankAccount, CreateBankAccountRequest, UpdateBankAccountRequest } from '../entities/BankAccount';
import { BankAccountRepository } from '../repositories/BankAccountRepository';
import { v4 as uuidv4 } from 'uuid';

export class BankAccountService  {

    constructor(private bankAccountRepository: BankAccountRepository) {}


  async create(userId: string, accountData: CreateBankAccountRequest): Promise<BankAccount> {

    return this.bankAccountRepository.create(userId,accountData)
  }

  async findById(accountId: string): Promise<BankAccount | null> {
    return this.bankAccountRepository.findById(accountId)
  }

  async findByPromptpay(promptPayNumber: string): Promise<BankAccount | null> {
    return this.bankAccountRepository.findByPromptPayNumber(promptPayNumber)
  }

  async findByUserId(userId: string): Promise<BankAccount[]> {


    return this.bankAccountRepository.findByUserId(userId)
  }

  async findAll(): Promise<BankAccount[]> {
    return this.bankAccountRepository.findAll()
  }

  async update(accountId: string, accountData: UpdateBankAccountRequest): Promise<BankAccount | null> {
    const bankAccount = await this.bankAccountRepository.findById(accountId);
    if (!bankAccount) return null;

    const updateAccount: BankAccount = {
      ...bankAccount,
      account_type: accountData.account_type || bankAccount.account_type,
      bank_name: accountData.bank_name || bankAccount.bank_name,
      prompt_pay_number: accountData.prompt_pay_number || bankAccount.prompt_pay_number,
    };

    const updatedBankAccount = await this.bankAccountRepository.update(updateAccount);
    return updatedBankAccount;
  }

  async delete(accountId: string): Promise<boolean> {
    return this.bankAccountRepository.delete(accountId);
  }

  async updateBalance(accountId: string, newBalance: number): Promise<BankAccount | null > {
    const bankAccount = await  this.bankAccountRepository.findById(accountId);
    if (!bankAccount) return null;

    const updateAccount: BankAccount = {
        ...bankAccount,
        balance : newBalance
      };

    const updatedAccount = await this.bankAccountRepository.update(updateAccount);
    return updatedAccount;
  }
}