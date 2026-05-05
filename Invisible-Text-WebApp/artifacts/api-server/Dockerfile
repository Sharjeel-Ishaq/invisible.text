# Use Node.js LTS
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base AS runtime
ENV NODE_ENV=production
RUN useradd --system --uid 1000 app || true
WORKDIR /usr/src/app
# Copy only the built artefacts and package metadata
COPY --from=build /usr/src/app/artifacts/api-server/dist ./dist
COPY --from=build /usr/src/app/artifacts/api-server/package.json ./package.json
COPY --from=build /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml

# Ensure pnpm is available and install only production dependencies
RUN corepack enable \
	&& pnpm install --frozen-lockfile --prod

# Drop privileges to a non-root user
RUN chown -R app:app /usr/src/app
USER app

EXPOSE 3000
CMD [ "node", "--enable-source-maps", "dist/index.mjs" ]
