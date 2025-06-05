import { Tool } from "@modelcontextprotocol/sdk/types";
import { toolTypes } from "./type";
import { describe } from "node:test";

export const checkBalanceTool: Tool = {

  name: toolTypes.CHECK_BALANCE,
  description: "Check your own current balance",
  inputSchema: {
    type: "object"
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