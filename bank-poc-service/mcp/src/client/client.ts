

export class BankingClient {




  constructor(private host : string){}



    async executeTransfer( amount : number,to_account_id?: string,prompt_pay_number? : string,): Promise<any> {
      console.log(this.host)
      const response = await fetch(`${this.host}/api/transfers`, {
        method: "POST",
        headers: {
          "user-id": "001", // this is fixed value for poc purpose in real scinario please use authentication
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          source_account_id: "001",// we mock this value to 001 (your own account)
          to_account_id,
          prompt_pay_number,
          amount: amount
        }),
      });
    
        return response.json();
      }

    async checkBalance(account_id : string ): Promise<any> {
      console.log(this.host)
      const response = await fetch(`${this.host}/api/accounts/${account_id}/balances`, {
        method: "GET",
        headers: {
          "user-id": "001", // this is fixed value for poc purpose in real scinario please use authentication
          "Content-Type": "application/json"
        },
      });
    
        return response.json();
      }

    async getUsersByName(first_name?: string, last_name? : string): Promise<any> {
      
      const params = new URLSearchParams();



      if (first_name) params.append('firstName', first_name);
      if (last_name) params.append('lastName', last_name);

      console.log(`${this.host}/api/users/search?${params.toString()}`)
      const response = await fetch(`${this.host}/api/users/search?${params.toString()}`, {
        method: "GET",
        headers: {
          "user-id": "001", // this is fixed value for poc purpose in real scinario please use authentication
          "Content-Type": "application/json"
        },
      });
    
        return response.json();
      }

    async getAccountInfoByUserId(user_id: string): Promise<any> {
      const response = await fetch(`${this.host}/api/users/${user_id}/accounts`, {
        method: "GET",
      });
    
        return response.json();
      }

    async convertCurrency(amount : number) : Promise<any> {
      console.log(this.host)
      const response = await fetch(`${this.host}/api/accounts/009/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: amount
        }),
      });
    
        return response.json();
      }
    

}