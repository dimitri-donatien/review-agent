FROM node:20-latest
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
