import { Tool } from "@modelcontextprotocol/sdk/types";
import { toolTypes } from "./type";

export const checkBalanceTool : Tool  = {
    
    name: toolTypes.CHECK_BALANCE,
    description : "Check your own current balance",
    inputSchema: {
        type : "object",
        properties : {
          account_id: {
            type : "string",
            description : "original or your own banking account number",
          }

        }
    }
}