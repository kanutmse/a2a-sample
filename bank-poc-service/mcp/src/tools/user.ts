import { Resource, Tool } from "@modelcontextprotocol/sdk/types";
import { toolTypes } from "./type";
import { object } from "zod";

export const getUserDetailTools : Tool  = {
  name: toolTypes.GET_USER_BY_NAME,
  description : "Get user information via firstName lastName or userId",
  inputSchema: {
    type : "object",
    properties : {
      first_name : {
        type : "string",
        description : "user's first name",
        required : false,
      },
      last_name : {
        type : "string",
        description : "user's last name",
        required : false,
      }
    }
  }
}