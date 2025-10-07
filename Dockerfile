FROM node:18-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Habilita o Corepack para usar a versão correta do Yarn.
RUN corepack enable

# Copia os arquivos de configuração do Yarn e o package.json primeiro.
# Isso garante que o Docker possa usar o cache se apenas o código-fonte mudar.
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn install --immutable

# Constrói a aplicação para produção.
FROM node:18-alpine AS builder
WORKDIR /app

# Habilita o Corepack novamente neste estágio.
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarnrc.yml ./
COPY --from=deps /app/.yarn ./.yarn
# Copia o restante do código da aplicação.
COPY . .

# Executa o script de build do Next.js.
RUN yarn build

# Prepara a imagem final, otimizada para produção.
FROM node:18-alpine AS runner
WORKDIR /app

# Habilita o Corepack no estágio final para garantir que o CMD use a versão correta do Yarn.
RUN corepack enable

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia os artefatos de build e as dependências de produção do estágio "builder".
# O --chown garante que o usuário 'nextjs' tenha permissão sobre os arquivos.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# Copia os arquivos de configuração e o lockfile do Yarn para o estágio final.
COPY --from=builder /app/.yarnrc.yml ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/.yarn ./.yarn

# Muda para o usuário não-root.
USER nextjs

EXPOSE 3000

CMD ["yarn", "serve"]
