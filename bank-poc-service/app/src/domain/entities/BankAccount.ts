export interface BankAccount {
    account_id: string;
    account_type: AccountType;
    balance : number
    currency? : Currency[]
    bank_name: string;
    prompt_pay_number?: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
  }

  export interface Currency {
    balance : number,
    currencyShorten :string 
    currentcy : string
  }
  
  export enum AccountType {
    SAVINGS = 'SAVINGS',
    TRAVELS = 'TRAVELS'
  }
  
  export interface CreateBankAccountRequest {
    account_type: AccountType;
    initial_balance: number;
    bank_name: string;
    prompt_pay_number: string;
  }
  
  export interface UpdateBankAccountRequest {
    account_type?: AccountType;
    bank_name?: string;
    prompt_pay_number?: string;
  }