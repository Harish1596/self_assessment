FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json vite.config.ts index.html ./
COPY src ./src
COPY shared ./shared
COPY server ./server
RUN npm run build

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production \
    RECALL_API_HOST=0.0.0.0 \
    RECALL_API_PORT=3001 \
    RECALL_STATIC_DIR=/app/dist
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node server ./server
COPY --chown=node:node shared ./shared
COPY --chown=node:node src ./src
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chmod=755 docker/entrypoint.sh /usr/local/bin/recall-entrypoint
USER node
EXPOSE 3001
ENTRYPOINT ["recall-entrypoint"]
