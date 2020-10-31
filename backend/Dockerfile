# If you uncomment the automatic webp conversion on the server, use ubuntu for the base image
# Note that this will increase build times significantly
FROM golang:latest
# Copy source
COPY . /bearpost/backend
WORKDIR /bearpost/backend

# Set timezone for ubuntu
# RUN export TZ=America/New_York
# Get packages for ubuntu
# RUN apt-get update -y -q && apt-get upgrade -y -q && \
#    DEBIAN_FRONTEND=noninteractive apt-get install golang git openssl jq -y

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
