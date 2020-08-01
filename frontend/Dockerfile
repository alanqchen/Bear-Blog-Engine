FROM alpine:latest
RUN apk --no-cache add ca-certificates
# Build Next.js (React) App

FROM node:alpine AS node_builder
ENV PORT 3000

# Create app directory
RUN mkdir -p /bearpost/frontend
WORKDIR /bearpost/frontend

# Installing dependencies
COPY package*.json /bearpost/frontend/
RUN npm install

# Copying source files
COPY . /bearpost/frontend

COPY docker.env.build /bearpost/frontend/.env.development

# Building app
RUN npm run build
EXPOSE 3000

# Running the app
CMD ["npm", "run", "start" ]
