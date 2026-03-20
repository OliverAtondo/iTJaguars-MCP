# 🐆 iTJaguars MCP Server

Servidor MCP que imprime el jaguar de **Jaguares de Tijuana** en consola cada vez que alguien menciona `iTJuana`, `Jaguars` o `iTJaguars`.

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

