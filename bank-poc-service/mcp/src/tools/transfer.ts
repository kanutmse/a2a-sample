import { Tool } from "@modelcontextprotocol/sdk/types";
import { toolTypes } from "./type";


export const bankTransferTool : Tool  = {
    
    name: toolTypes.BANK_TRANSFER,
    description : "Transfer money from user A to user B",
    inputSchema: {
        type : "object",
        properties : {
          // source_account_id: {
          //   type : "string",
          //   description : "original or your own banking account number",
          // }, // we mock this value to 001 (your own account)
          to_account_id: {
            type : "string",
            description : "destination banking account number",
            required : false,
          },
          prompt_pay_number: {
            type : "string",
            description : "another type of destination account number named promptpay",
            required : false,
          },
          amount: {
            type : "number",
            description : "amount transfer",
            required : true,
            default : 0
          }

        }
    }
}