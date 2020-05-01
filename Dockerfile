
# build stage
FROM golang:alpine AS builder
WORKDIR /go/src/github.com/alanqchen/bear-post/backend
COPY . .
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

# Add Maintainer Info
LABEL maintainer="Alan Chen"

# Copy go mod and sum files
COPY go.mod go.sum ./

RUN go get -d -v ./...
RUN go install -v ./...

# Download dependencies
RUN go mod download

# final stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates
COPY --from=builder /go/bin/app /app
ENTRYPOINT ./app
LABEL Name=bear-post Version=0.0.1

# Build GO api
RUN go build -o main .

EXPOSE 8080

# Run executable
CMD [ "./main" ]
