import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { BankingClient } from "./client/client";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { bankTransferTool } from './tools/transfer'
import { toolTypes } from "./tools/type";
import { checkBalanceArg, executeTransferArgs, getAccountInfoByUserId, getUserByNameArgs } from "./client/type";
import express from "express";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js"
import { checkBalanceTool } from "./tools/bank";
import { tools } from "./tools";

const HOST: string = process.env.BANKING_HOST || 'http://localhost:3000'
const PROTOCOLS = ["stdio", "streamable-http"] as const;
type Protocol = typeof PROTOCOLS[number];

interface CLIArgs {
  protocol: Protocol;
  port?: number;
  host?: string;
  help?: boolean;
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const parsed: CLIArgs = {
    protocol: "streamable-http", // default
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--help':
      case '-h':
        parsed.help = true;
        break;
      case '--protocol':
      case '-p':
        const protocol = args[++i];
        if (!protocol || !PROTOCOLS.includes(protocol as Protocol)) {
          throw new Error(`Invalid protocol: ${protocol}. Must be one of: ${PROTOCOLS.join(', ')}`);
        }
        parsed.protocol = protocol as Protocol;
        break;
      case '--port':
        const port = parseInt(args[++i]);
        if (isNaN(port) || port < 1 || port > 65535) {
          throw new Error(`Invalid port: ${args[i]}. Must be a number between 1 and 65535`);
        }
        parsed.port = port;
        break;
      case '--host':
        parsed.host = args[++i];
        if (!parsed.host) {
          throw new Error('Host value is required when using --host flag');
        }
        break;
      default:
        if (arg.startsWith('-')) {
          throw new Error(`Unknown option: ${arg}`);
        }
        break;
    }
  }

  return parsed;
}

function printHelp() {
  console.log(`
Banking MCP Server

Usage: node index.js [options]

Options:
  -h, --help              Show this help message
  -p, --protocol <type>   Transport protocol to use (${PROTOCOLS.join('|')}) [default: stdio]
  --port <number>         Port number for HTTP transport [default: 3001]
  --host <string>         Banking service host URL [default: ${HOST}]

Examples:
  node index.js                                    # Use HTTP transport
  node index.js --protocol streamable-http        # Use HTTP transport on port 3001
  node index.js --protocol streamable-http --port 8080  # this is mcp port not banking port
  node index.js --host http://banking.example.com
`);
}

async function createServer(bankingHost: string): Promise<Server> {
  const server = new Server(
    {
      name: "Banking MCP Server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  const bankClient = new BankingClient(bankingHost);

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      console.error("Received CallToolRequest:", request);
      try {
        if (!request.params.arguments) {
          console.error("No arguments provided");
          throw new Error("No arguments provided");
        }

        switch (request.params.name) {
          case toolTypes.BANK_TRANSFER: {
            console.error("Executing bank transfer");
            const args = request.params
              .arguments as unknown as executeTransferArgs;

            if (!args.amount) {
              throw new Error(
                "Missing required arguments: amount",
              );
            }

            if (!args.prompt_pay_number && !args.to_account_id){
              throw new Error(
                "Missing required arguments: prompt_pay_number or to_account_id",
              );
            }

            const response = await bankClient.executeTransfer(
              args.amount,
              args.to_account_id,
              args.prompt_pay_number
            );
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }
          case toolTypes.CHECK_BALANCE: {
            // console.error("Executing check balance");

            // console.error("Executing bank transfer");
            // const args = request.params
            //   .arguments as unknown as checkBalanceArg;

            // if (!args.account_id) {
            //   throw new Error(
            //     "Missing required arguments: account_ids",
            //   );
            // }
            const response = await bankClient.checkBalance(
            );
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }
          case toolTypes.GET_USER_BY_NAME:{

            const args = request.params
              .arguments as unknown as getUserByNameArgs;
            const response = await bankClient.getUsersByName(args.first_name,args.last_name)

            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }
          case toolTypes.GET_BANK_BY_USER_ID : {

            const args = request.params
          .arguments as unknown as getAccountInfoByUserId;

          const response = await bankClient.getAccountInfoByUserId(args.user_id)

          return {
            content: [{ type: "text", text: JSON.stringify(response) }],
          };

          }
          default:
            console.error(`Unknown tool: ${request.params.name}`);
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        console.error("Error executing tool:", error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
        };
      }
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error("Received ListToolsRequest");
    return {
      tools: [
          ...tools
      ],
    };
  });

  return server;
}

async function startStdioServer(server: Server) {
  console.error("Starting Banking MCP Server with stdio transport...");
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Banking MCP Server connected via stdio");
}

async function startHttpServer(server: Server, port: number) {
  console.error(`Starting Banking MCP Server with HTTP transport on port ${port}...`);

  const app = express();
  app.use(express.json())

  const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

  // Handle POST requests for client-to-server communication
  app.post('/mcp', async (req, res) => {
    // Check for existing session ID
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
      // Reuse existing transport
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New initialization request
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sessionId) => {
          // Store the transport by session ID
          transports[sessionId] = transport;
        }
      });

      // Clean up transport when closed
      transport.onclose = () => {
        if (transport.sessionId) {
          delete transports[transport.sessionId];
        }
      };
      // Connect to the MCP server
      await server.connect(transport);
    } else {
      // Invalid request
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided',
        },
        id: null,
      });
      return;
    }

    // Handle the request
    await transport.handleRequest(req, res, req.body);
  });

  // Reusable handler for GET and DELETE requests
  const handleSessionRequest = async (req: express.Request, res: express.Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
      res.status(400).send('Invalid or missing session ID');
      return;
    }

    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  };

  // Handle GET requests for server-to-client notifications via SSE
  app.get('/mcp', handleSessionRequest);

  // Handle DELETE requests for session termination
  app.delete('/mcp', handleSessionRequest);


  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'Banking MCP Server' });
  });

  app.listen(port, () => {
    console.error(`Banking MCP Server listening on port ${port}`);
    console.error(`Health check: http://localhost:${port}/health`);
    console.error(`MCP endpoint: http://localhost:${port}/mcp`);
  });
}

async function main() {
  try {
    const args = parseArgs();

    if (args.help) {
      printHelp();
      process.exit(0);
    }

    const bankingHost = args.host || HOST;
    const server = await createServer(bankingHost);

    console.error(`Using banking host: ${bankingHost}`);
    console.error(`Using protocol: ${args.protocol}`);

    switch (args.protocol) {
      case 'stdio':
        await startStdioServer(server);
        break;
      case 'streamable-http':
        const port = args.port || 3001;
        await startHttpServer(server, port);
        break;
      default:
        throw new Error(`Unsupported protocol: ${args.protocol}`);
    }

  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error(`Unexpected error:`, error);
    }
    console.error('\nUse --help for usage information');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('\nReceived SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('\nReceived SIGTERM, shutting down gracefully...');
  process.exit(0);
});

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});