# 🐆 iTJaguars MCP Server

Servidor MCP que imprime el jaguar de **Jaguares de Tijuana** en consola cada vez que alguien menciona `iTJuana`, `Jaguars` o `iTJaguars`.

---

## Instalación

```bash
cd itjaguars-mcp
npm install
```

---

## Uso con Claude Code

Agrega esto a tu archivo de configuración MCP (`~/.claude/claude_desktop_config.json` o el equivalente de Claude Code):

```json
{
  "mcpServers": {
    "itjaguars": {
      "command": "node",
      "args": ["/ruta/absoluta/a/itjaguars-mcp/index.js"]
    }
  }
}
```

Reinicia Claude Code y listo. Cuando escribas cualquiera de estas palabras, el jaguar aparece en consola:

| Palabra clave | Ejemplo |
|---|---|
| `iTJuana` | "¿Cómo le fue a iTJuana?" |
| `Jaguars` | "Los Jaguars jugaron bien" |
| `iTJaguars` | "¡Arriba iTJaguars!" |

---

## Herramientas disponibles

### `check_jaguars`
Analiza un mensaje y, si contiene las palabras clave, imprime el jaguar.

```json
{
  "tool": "check_jaguars",
  "arguments": { "message": "Vamos iTJuana!" }
}
```

### `roar`
Imprime el jaguar directamente sin importar el mensaje.

```json
{
  "tool": "roar",
  "arguments": {}
}
```

---

## Prueba rápida

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"check_jaguars","arguments":{"message":"vamos iTJuana!"}}}' | node index.js
```

---

¡Arriba los Felinos! 🐆
