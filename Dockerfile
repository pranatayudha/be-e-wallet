# Stage 1: Build the application
FROM node:20.11.0-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

# Stage 2: Create the production image
FROM node:20.11.0-slim
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
RUN npm install --omit=dev --force
EXPOSE 3000
ENV STAGE=dev
CMD ["node" , "dist/main"]
