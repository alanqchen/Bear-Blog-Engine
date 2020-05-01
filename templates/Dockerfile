# build stage
FROM golang:alpine

WORKDIR /backend

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

# Add Info
LABEL maintainer="Alan Chen <chen.8943@osu.edu>"
LABEL Name=bear-post Version=0.0.1

# Copy go mod and sum files
COPY backend/go.mod backend/go.sum backend/config/app.json backend/config/api.rsa backend/config/api.rsa.pub ./

# Download dependencies
RUN go mod download

# Copy source to working directory in container
COPY /backend .

# Build GO api
RUN go build -o backend/main .

EXPOSE 8080

# Run executable
CMD [ "backend/main" ]

