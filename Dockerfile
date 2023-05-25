# Build stage
FROM node:16-alpine3.14 AS build

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache git python3 make g++ && \
    npm install --only=production && \
    npm ci --ignore-scripts && \
    npm cache clean --force

COPY . .

RUN npm prune --production && \
    apk del git python3 make g++

# Runtime stage
FROM node:16-alpine3.14 AS runtime

WORKDIR /app

COPY --from=build /app/src ./src
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

CMD ["node", "src/index.js"]
