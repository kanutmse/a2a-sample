import { Tool } from "@modelcontextprotocol/sdk/types";
import { checkBalanceTool, convertCurrency, getBankDetailByUserId } from "./bank";
import { bankTransferTool } from "./transfer";
import { getUserDetailTools } from "./user";



export const  tools : Tool[] = [

    checkBalanceTool,
    getBankDetailByUserId,
    bankTransferTool,
    getUserDetailTools,
    convertCurrency
]