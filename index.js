import express from "express";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// ============================================================
//  ASCII ART — JAGUAR iTJuana
// ============================================================
const JAGUAR_ASCII = `
              #####                                             #####                            
              ##    ####                                     ####    ##                           
              ########  #################   #################  #####  #                           
              ####   ### ###  ###  ### ####### ##   ###  ### ###  ## ##                           
              #####  ###       ##   ###########   ##       ###  ## ###                           
                #  ####          ###  ##### ###  ###          ####  ##                            
                ####################  #########  ####################                             
                ##   ## ### ### ## ##  #######  ##### ### ### ##   ##                             
                ## ### ###########  #  ####### ##  ########### ### ##                             
                ## ### #####  ####  ## #### ## ##  ####  ##### ### ##                             
                ###      ##    ##   #############   ##     #      ###                             
                # ####   ##   ###  ##           ##  ##    ##   #### #                             
              ## ####### #####    #             #    ####  ######  ##                            
              ## #### ############################# ######### ###  ##                            
              ## ##### ###    ####               ## ##    ## ####  ##                            
              ## ###### ##    ####               ## ##    # #####   #                            
              #  ##### ###    #########    #######  ##    ## ####   #                            
              ## #########    ##   ####    #####    ##    #######  ##                            
              ############    ##     ##    ##       ##    ###########                            
                ###########    ##     ##    ##       ##    ####### ##                             
                ##### ####    ##  #####    ## ###   ##    ### #####                              
                  #########    #####  ##    ##   #####     ##### ##                               
                  ### ####     ##    ##    ##     #      #### ###                                
                    ######     ##    ##    ##     #     #######                                  
                      #########################################                                   
                      ######## #### ##       #  # # #########                                    
                        ##### #### ####       #### #### # ###                                     
                          ##### ##   ##       #    # ## ###                                       
                              ##########################                                                                                                                                                                                                              

   ██╗████████╗     ██╗██╗   ██╗ █████╗ ███╗   ██╗ █████╗ 
   ██║╚══██╔══╝     ██║██║   ██║██╔══██╗████╗  ██║██╔══██╗
   ██║   ██║        ██║██║   ██║███████║██╔██╗ ██║███████║
   ██║   ██║   ██   ██║██║   ██║██╔══██║██║╚██╗██║██╔══██║
   ██║   ██║   ╚█████╔╝╚██████╔╝██║  ██║██║ ╚████║██║  ██║
   ╚═╝   ╚═╝    ╚════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
`;

// ============================================================
//  Detección de palabras clave
// ============================================================
const KEYWORDS = ["itjuana", "jaguars", "itjaguars", "i tjuana"];

function hasJaguarKeyword(text) {
  const clean = text.toLowerCase().replace(/[^a-z0-9 ]/g, "");
  return KEYWORDS.some((kw) => clean.includes(kw));
}

// ============================================================
//  Factory: crea un McpServer nuevo por sesión
// ============================================================
function buildServer() {
  const server = new McpServer({
    name: "itjaguars-mcp",
    version: "1.0.0",
  });

  server.tool(
    "check_jaguars",
    "Detecta si el mensaje menciona iTJuana, Jaguars o iTJaguars e imprime el jaguar en la consola del usuario.",
    { message: z.string().describe("El mensaje a analizar") },
    async ({ message }) => {
      if (hasJaguarKeyword(message)) {
        return {
          content: [
            {
              type: "text",
              text: JAGUAR_ASCII,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `No se detectaron palabras clave en: "${message}". Prueba con 'iTJuana', 'Jaguars' o 'iTJaguars'.`,
          },
        ],
      };
    }
  );

  server.tool(
    "roar",
    "Imprime el jaguar de iTJuana en la consola del usuario.",
    {},
    async () => {
      return {
        content: [{ type: "text", text: JAGUAR_ASCII }],
      };
    }
  );

  return server;
}

// ============================================================
//  Express + Streamable HTTP transport
// ============================================================
const app = express();
app.use(express.json());

// Sesiones activas en memoria
const transports = {};

// Health check para Render
app.get("/health", (_req, res) => {
  res.json({ status: "ok", server: "itjaguars-mcp", sessions: Object.keys(transports).length });
});

// Endpoint principal MCP — POST
app.post("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"];
  let transport;

  if (sessionId && transports[sessionId]) {
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (id) => {
        transports[id] = transport;
      },
    });
    transport.onclose = () => {
      if (transport.sessionId) delete transports[transport.sessionId];
    };
    const server = buildServer();
    await server.connect(transport);
  } else {
    res.status(400).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Bad Request: sesión inválida o faltante" },
      id: null,
    });
    return;
  }

  await transport.handleRequest(req, res, req.body);
});

// Endpoint MCP — GET (notificaciones servidor → cliente)
app.get("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"];
  const transport = sessionId && transports[sessionId];
  if (!transport) { res.status(400).json({ error: "Sesión no encontrada" }); return; }
  await transport.handleRequest(req, res);
});

// Endpoint MCP — DELETE (terminar sesión)
app.delete("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"];
  const transport = sessionId && transports[sessionId];
  if (!transport) { res.status(400).json({ error: "Sesión no encontrada" }); return; }
  await transport.handleRequest(req, res);
});

// ============================================================
//  Iniciar servidor
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🐆 iTJaguars MCP Server escuchando en el puerto ${PORT}`);
  console.log(`   Endpoint MCP:  POST/GET/DELETE /mcp`);
  console.log(`   Health check:  GET /health`);
});