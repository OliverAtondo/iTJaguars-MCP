FROM node:20-alpine

WORKDIR /app

# Copiar dependencias primero (cache de capas)
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar código fuente
COPY index.js ./

# Render asigna el puerto via variable de entorno
ENV PORT=3000
EXPOSE 3000

CMD ["node", "index.js"]
