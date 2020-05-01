# build stage
FROM golang:alpine
WORKDIR $PWD/backend

ADD . $PWD/backend

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

# Add Info
LABEL maintainer="Alan Chen <chen.8943@osu.edu>"
LABEL Name=bear-post Version=0.0.1

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source to working directory in container
COPY . .

# Build GO api
RUN go build -o main .

EXPOSE 8080

# Run executable
CMD [ "./main" ]

