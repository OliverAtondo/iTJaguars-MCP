#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ============================================================
//  ASCII ART — JAGUAR iTJuana
// ============================================================
const JAGUAR_ASCII = `
\x1b[33m
        /\\_____/\\
       /  o   o  \\
      ( ==  ^  == )
       )         (
      (           )
     ( (  )   (  ) )
    (__(__)___(__)__)

   ██╗████████╗     ██╗██╗   ██╗ █████╗ ███╗   ██╗ █████╗ 
   ██║╚══██╔══╝     ██║██║   ██║██╔══██╗████╗  ██║██╔══██╗
   ██║   ██║        ██║██║   ██║███████║██╔██╗ ██║███████║
   ██║   ██║   ██   ██║██║   ██║██╔══██║██║╚██╗██║██╔══██║
   ██║   ██║   ╚█████╔╝╚██████╔╝██║  ██║██║ ╚████║██║  ██║
   ╚═╝   ╚═╝    ╚════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝

\x1b[0m`;

// ============================================================
//  Palabras clave que disparan al jaguar
// ============================================================
const JAGUAR_KEYWORDS = [
  "itjuana",
  "jaguars",
  "itjaguars",
  "i tjuana",
  "i t juana",
];

function containsJaguarKeyword(text) {
  const lower = text.toLowerCase().replace(/[^a-z0-9 ]/g, "");
  return JAGUAR_KEYWORDS.some((kw) => lower.includes(kw));
}

function printJaguar() {
  process.stderr.write(JAGUAR_ASCII + "\n");
}

// ============================================================
//  Servidor MCP
// ============================================================
const server = new Server(
  { name: "itjaguars-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// ── Listar herramientas disponibles ──────────────────────────
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "check_jaguars",
      description:
        "Detecta si el mensaje contiene referencias a iTJuana, Jaguars o iTJaguars y muestra el jaguar en consola.",
      inputSchema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "El mensaje a analizar",
          },
        },
        required: ["message"],
      },
    },
    {
      name: "roar",
      description:
        "Imprime el jaguar de iTJuana directamente en consola sin importar el mensaje.",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  ],
}));

// ── Ejecutar herramientas ────────────────────────────────────
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "check_jaguars") {
    const message = args?.message ?? "";
    const detected = containsJaguarKeyword(message);

    if (detected) {
      printJaguar();
      return {
        content: [
          {
            type: "text",
            text: "🐆 ¡JAGUARES DETECTADOS! El jaguar de iTJuana ha sido impreso en consola. ¡Arriba los Felinos!",
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `No se detectaron palabras clave de iTJuana/Jaguars en: "${message}". Prueba con 'iTJuana', 'Jaguars' o 'iTJaguars'.`,
          },
        ],
      };
    }
  }

  if (name === "roar") {
    printJaguar();
    return {
      content: [
        {
          type: "text",
          text: "🐆 ¡ROOAARRR! El jaguar ha rugido en consola.",
        },
      ],
    };
  }

  return {
    content: [{ type: "text", text: `Herramienta desconocida: ${name}` }],
    isError: true,
  };
});

// ============================================================
//  Arrancar el servidor
// ============================================================
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(
    "🐆 iTJaguars MCP Server corriendo. Esperando mensajes...\n"
  );
}

main().catch((err) => {
  process.stderr.write(`Error fatal: ${err.message}\n`);
  process.exit(1);
});
