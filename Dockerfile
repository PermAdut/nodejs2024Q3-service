# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.9.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src

RUN mkdir -p /usr/src/dist/logs && chown -R node:node /usr/src/dist
RUN npm install -g @nestjs/cli

FROM base AS deps
COPY package.json package-lock.json ./  
COPY ./prisma ./prisma 
RUN npm install --force

FROM deps AS build
COPY . .  
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build  

FROM base AS final
ENV NODE_ENV=production
USER node
COPY package.json ./  
COPY --from=deps /usr/src/node_modules ./node_modules
COPY --from=build /usr/src/dist ./dist  
COPY --from=build /usr/src/prisma ./prisma  

EXPOSE 4000
CMD ["node", "dist/main.js"]
