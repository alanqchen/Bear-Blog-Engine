# build stage
FROM golang:alpine
# Copy source
COPY . /bearpost/backend
WORKDIR /bearpost/backend
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh openssl jq
# Gen jwt keys
RUN openssl genrsa -out config/api.rsa 4096
RUN openssl rsa -in config/api.rsa -pubout > config/api.rsa.pub
# Add Info
LABEL maintainer="Alan Chen <chen.8943@osu.edu>"
LABEL Name=bear-post Version=0.0.1
# Download dependencies
RUN go mod download
# Build
RUN go build -o /bearpost/backend/main .

EXPOSE 8080

# Run executable
CMD [ "/bearpost/backend/main" ]
