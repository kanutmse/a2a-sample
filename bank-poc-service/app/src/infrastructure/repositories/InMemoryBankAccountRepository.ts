import { AccountType, BankAccount, CreateBankAccountRequest, UpdateBankAccountRequest } from '../../domain/entities/BankAccount';
import { BankAccountRepository } from '../../domain/repositories/BankAccountRepository';
import { v4 as uuidv4 } from 'uuid';


  const mocksBankAccount : BankAccount[] = [
    {
      account_id: "001",
      account_type: AccountType.SAVINGS,
      balance: 100000,
      bank_name: "Bank A",
      prompt_pay_number: "0812345678",
      user_id: "001",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      account_id: "009",
      account_type: AccountType.TRAVELS,
      balance: 0,
      currency : [{
        balance : 0,
        currencyShorten : "Yen" ,
        currentcy : "JAPANESE YEN"
      }],
      bank_name: "Bank A",
      prompt_pay_number: "0812345678",
      user_id: "001",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      account_id: "002",
      account_type: AccountType.SAVINGS,
      balance: 200,
      bank_name: "Bank B",
      prompt_pay_number: "0212345678",
      user_id: "002",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      account_id: "003",
      account_type: AccountType.SAVINGS,
      balance: 200,
      bank_name: "Bank B",
      prompt_pay_number: "0287654321",
      user_id: "003",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      account_id: "004",
      account_type: AccountType.SAVINGS,
      balance: 200,
      bank_name: "Bank B",
      prompt_pay_number: "0112345678",
      user_id: "004",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      account_id: "1102315624",
      account_type: AccountType.SAVINGS,
      balance: 200,
      bank_name: "Bank B",
      prompt_pay_number: "0312345678",
      user_id: "005",
      created_at: new Date(),
      updated_at: new Date()
    },
  ]

export class InMemoryBankAccountRepository implements BankAccountRepository {
  private accounts: Map<string, BankAccount> = new Map();

  constructor() {
    mocksBankAccount.forEach(account => {
      this.accounts.set(account.account_id, account);
    });
  }
  async findByPromptPayNumber(promptPayNumber: string): Promise<BankAccount | null> {
   
    
    const account = Array.from(this.accounts.values()).find(account => 
      account.prompt_pay_number === promptPayNumber
    );
    
    return account || null;
  }


  async create(userId: string, accountData: CreateBankAccountRequest): Promise<BankAccount> {
    const account: BankAccount = {
      account_id: uuidv4(),
      account_type: accountData.account_type,
      balance: accountData.initial_balance,
      bank_name: accountData.bank_name,
      prompt_pay_number: accountData.prompt_pay_number,
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date()
    };

    this.accounts.set(account.account_id, account);
    return account;
  }

  async findById(accountId: string): Promise<BankAccount | null> {
    return this.accounts.get(accountId) || null;
  }

  async findByUserId(userId: string): Promise<BankAccount[]> {
    return Array.from(this.accounts.values()).filter(account => {
      return account.user_id === userId}
    );
  }

  async findAll(): Promise<BankAccount[]> {
    return Array.from(this.accounts.values());
  }

  async update(bankAccount: BankAccount): Promise<BankAccount | null> {

    const updatedAccount: BankAccount = {
        ...bankAccount,
        updated_at: new Date(),
    };

    this.accounts.set(updatedAccount.account_id, updatedAccount);
    return updatedAccount;
  }

  async delete(accountId: string): Promise<boolean> {
    return this.accounts.delete(accountId);
  }

  async updateBalance(accountId: string, newBalance: number): Promise<boolean> {
    const account = this.accounts.get(accountId);
    if (!account) return false;

    account.balance = newBalance;
    account.updated_at = new Date();
    this.accounts.set(accountId, account);
    return true;
  }
}