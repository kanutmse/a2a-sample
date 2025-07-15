import { Tool } from "@modelcontextprotocol/sdk/types";
import { toolTypes } from "./type";
import { describe } from "node:test";

export const checkBalanceTool: Tool = {

  name: toolTypes.CHECK_BALANCE,
  description: "Check your own current balance use 001 if are saving use 009 for travels account",
  inputSchema: {
    type: "object",
    properties : {
      account_id : {
        type : "string",
        description : "account Id for checking balance 001 for saving 009 for travels account",
        required : true,
      }
    }
  },
}


export const getBankDetailByUserId: Tool = {

  name: toolTypes.GET_BANK_BY_USER_ID,
  description: "This service for getting bank information by using userId",
  inputSchema: {
    type: "object",
    properties : {
      user_id : {
        type : "string",
        description : "userId for retriving information",
        required : true,
      }
    }
  },

}


export const convertCurrency : Tool = {
  name: toolTypes.CONVERT_CURRENCY,
  description : "Convert currency from Thai baht to Japanese Yen",
  inputSchema: {
      type : "object",
      properties : {
        amount: {
          type : "number",
          description : "amount to convert from Thai baht to Japanese Yen",
          required : true,
        },

      }
  }
}