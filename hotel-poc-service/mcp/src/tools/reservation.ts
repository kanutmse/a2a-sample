import { Tool } from "@modelcontextprotocol/sdk/types";
import { toolTypes } from "./type";
import { describe } from "node:test";

export const getCurrentReservation: Tool = {

  name: toolTypes.GET_CURRENT_RESERVATION,
  description: "Check your current hotel reservation",
  inputSchema: {
    type: "object"
  },
}