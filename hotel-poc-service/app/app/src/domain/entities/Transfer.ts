export interface TransferRequest {
    source_account_id: string;
    to_account_id?: string;
    prompt_pay_number?: string;
    amount: number;
  }
  
  export interface Transfer {
    transfer_id: string;
    source_account_id: string;
    to_account_id: string;
    amount: number;
    status: TransferStatus;
    created_at: Date;
    user_id: string;
  }
  
  export enum TransferStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
  }