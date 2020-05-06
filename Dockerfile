# build stage
FROM golang:alpine
ADD . /bearpost
WORKDIR /bearpost/backend
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh openssl
# Gen keys
RUN openssl genrsa -out config/api.rsa 4096
RUN openssl rsa -in config/api.rsa -pubout > config/api.rsa.pub
# Add Info
LABEL maintainer="Alan Chen <chen.8943@osu.edu>"
LABEL Name=bear-post Version=0.0.1
# Copy go mod and sum files
COPY backend/go.mod backend/go.sum backend/config/app.json ./
COPY backend/config/app.json ./config/app.json
# Download dependencies
RUN go mod download
# Copy source to working directory in container
COPY /backend .
# Build
RUN go build -o bearpost/backend/main .

EXPOSE 8080

# Run executable
CMD [ "backend/main" ]

