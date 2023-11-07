FROM node:18-alpine3.17 AS base
WORKDIR /app

FROM base AS deps

COPY ./package-lock.json ./
COPY ./package.json ./

FROM deps as prod-deps

RUN npm i --production

FROM deps as build-deps

RUN npm i --production=false

FROM build-deps AS builder

COPY ./.astro ./.astro
COPY ./.env.production ./
COPY ./astro.config.mjs ./
COPY ./tailwind.config.mjs ./
COPY ./tsconfig.json ./
COPY ./public ./public
COPY ./src ./src

RUN npm run build

FROM base

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist/ ./dist

ENV HOST=0.0.0.0
CMD ["node", "dist/server/entry.mjs"]
