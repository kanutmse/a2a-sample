import { Tool } from "@modelcontextprotocol/sdk/types";
import { toolTypes } from "./type";


export const bankTransferTool : Tool  = {
    
    name: toolTypes.BANK_TRANSFER,
    description : "Transfer money from user A to user B",
    inputSchema: {
        type : "object",
        properties : {
          source_account_id: {
            type : "string",
            description : "original or your own banking account number",
          },
          to_account_id: {
            type : "string",
            description : "destination banking account number",
          },
          amount: {
            type : "number",
            description : "amount transfer",
            default : 0
          }

        }
    }
}