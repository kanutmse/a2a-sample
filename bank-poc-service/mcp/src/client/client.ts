

  // User routes
//   router.post('/users', (req, res) => userController.createUser(req, res));
//   router.get('/users/:id', (req, res) => userController.getUser(req, res));
//   router.get('/users', (req, res) => userController.getAllUsers(req, res));
//   router.put('/users/:id', (req, res) => userController.updateUser(req, res));
//   router.delete('/users/:id', (req, res) => userController.deleteUser(req, res));

//   // Bank Account routes
//   router.post('/accounts', (req, res) => bankAccountController.createAccount(req, res));
//   router.get('/accounts/:id', (req, res) => bankAccountController.getAccount(req, res));
//   router.get('/accounts', (req, res) => bankAccountController.getAllAccounts(req, res));
//   router.get('/users/:userId/accounts', (req, res) => bankAccountController.getUserAccounts(req, res));
//   router.put('/accounts/:id', (req, res) => bankAccountController.updateAccount(req, res));
//   router.delete('/accounts/:id', (req, res) => bankAccountController.deleteAccount(req, res));

//   // Transfer routes
//   router.post('/transfers', (req, res) => transferController.executeTransfer(req, res));
//   router.get('/transfers/:id', (req, res) => transferController.getTransfer(req, res));
//   router.get('/users/:userId/transfers', (req, res) => transferController.getUserTransfers(req, res));


export class BankingClient {




  constructor(private host : string){}



    async executeTransfer(source_account_id: string, to_account_id: string, amount : number): Promise<any> {
      console.log(this.host)
      const response = await fetch(`${this.host}/api/transfers`, {
        method: "POST",
        headers: {
          "user-id": "001", // this is fixed value for poc purpose in real scinario please use authentication
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          source_account_id: source_account_id,
          to_account_id: to_account_id,
          amount: amount
        }),
      });
    
        return response.json();
      }

      async checkBalance(account_id: string): Promise<any> {
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

}