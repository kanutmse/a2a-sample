export interface executeTransferArgs {
    source_account_id: string
    to_account_id: string
    prompt_pay_number : string
    amount : number
  }

export interface checkBalanceArg {
  account_id : string
}

export interface getUserByNameArgs{
  first_name? :string
  last_name? : string
}

export interface getAccountInfoByUserId {
  user_id : string
}