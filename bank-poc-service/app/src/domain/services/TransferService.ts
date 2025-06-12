import { TransferRequest, Transfer, TransferStatus } from '../entities/Transfer';
import { TransferRepository } from '../repositories/TransferRepository';
import { v4 as uuidv4 } from 'uuid';
import { BankAccountService } from './BankAccountService';
import { BankAccount } from '../entities/BankAccount';

export class TransferService {

  constructor(
    private bankAccountService : BankAccountService,
    private transferRepository: TransferRepository
  ) {}

  async executeTransfer(userId: string, transferRequest: TransferRequest): Promise<Transfer> {
    const { source_account_id, to_account_id, prompt_pay_number, amount } = transferRequest;

    // Validate amount
    if (amount <= 0) {
      throw new Error('Transfer amount must be positive');
    }

    // Get source account
    const sourceAccount = await this.bankAccountService.findById(source_account_id);
    if (!sourceAccount) {
      throw new Error('Source account not found');
    }

    // Check ownership
    if (sourceAccount.user_id !== userId) {
      throw new Error('Unauthorized: You do not own this account');
    }

    let destinationAccount : BankAccount | null = null

    if (to_account_id) {
       destinationAccount = await this.bankAccountService.findById(to_account_id);
    }

    if (prompt_pay_number) {
      destinationAccount = await this.bankAccountService.findByPromptpay(prompt_pay_number);
    }

    if (!destinationAccount) {
      throw new Error('Destination account not found');
    }

    // Get destination account


    // Check sufficient balance
    if (sourceAccount.balance < amount) {
      throw new Error('Insufficient funds');
    }

    // Create transfer record
    const transfer: Transfer = {
      transfer_id: uuidv4(),
      source_account_id,
      to_account_id : destinationAccount.account_id,
      amount,
      status: TransferStatus.PENDING,
      created_at: new Date(),
      user_id: userId
    };

    // Execute transfer
    try {
      // Update balances
      await this.bankAccountService.updateBalance(source_account_id, sourceAccount.balance - amount);
      await this.bankAccountService.updateBalance(destinationAccount.account_id, destinationAccount.balance + amount);

      // Update transfer status
      transfer.status = TransferStatus.COMPLETED;
      
      return await this.create(transfer);
    } catch (error) {
      transfer.status = TransferStatus.FAILED;
      await this.create(transfer);
      throw new Error('Transfer failed');
    }
  }

  async create (transfer : Transfer) : Promise<Transfer>{

    const transfered = await this.transferRepository.create(transfer)

    
    
    if (transfered.to_account_id === "003") {
      try {
        const response = await fetch(`http://localhost:4000/reservation/001/payment-status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            paymentStatus: "Completed"
          })
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log('Payment status updated successfully:', data);
      } catch (error) {
        console.error('Failed to update payment status:', error);
        throw error;
      }
    
      }
    
  

    
    return transfered
  }

   async findById(transferId: string) : Promise<Transfer | null> {
        return this.transferRepository.findById(transferId)
    }
    async findByUserId(userId: string) : Promise<Transfer[]> {
        return this.transferRepository.findByUserId(userId)
    }
}