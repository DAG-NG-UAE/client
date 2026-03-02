FROM node:20-slim AS base

FROM base AS deps
# 1. Standard Linux build tools
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./

# 2. Install EVERYTHING including the specific binary that's failing
# We remove --no-optional here because Tailwind 4's CSS engine needs them
RUN npm install
# RUN npm install @lightningcss/linux-x64-gnu --save-dev

FROM base AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_URL 
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL 
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 3. Create the dummy file for the canvas fix
RUN echo "export default {};" > empty.js

ENV NEXT_TELEMETRY_DISABLED=1
# 4. Use Webpack to bypass the Turbopack/CSS binary conflict
RUN npx next build --webpack

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT=3000

# Next.js 16 requires 'npm start' to run the built app
CMD ["npm", "start"]