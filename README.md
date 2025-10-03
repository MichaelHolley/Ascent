# Ascent

[![Build & Publish](https://github.com/MichaelHolley/Ascent/actions/workflows/docker_publish.yml/badge.svg?branch=main)](https://github.com/MichaelHolley/Ascent/actions/workflows/docker_publish.yml)

A simple and intuitive app to track, build, and maintain your habits for a better you!

## Screenshots

<img src="https://github.com/user-attachments/assets/feedddc6-df51-4815-97d8-b7f585c4dc3e" width="800" />

<img src="https://github.com/user-attachments/assets/afc8594c-7bb8-49b1-bd43-69ab3a455668" width="400" />

## Running locally

Start the database:
`pnpm db:start`

Launch another console and generate Prisma Client:
`pnpm prisma:generate`

Migrate the database:
`pnpm prisma:migrate-dev`

Start the web server:
`pnpm dev`

## Deployment

### `docker-compose.yml`

```yml
services:
  ascentweb:
    image: mpholley/ascent:latest
    restart: always
    ports:
      - 3000:3000
    depends_on:
      - db
    environment:
      - DATABASE_URL=mysql://root:mysecretpassword@db:3306/Ascent
      - ORIGIN=
  db:
    image: mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: mysecretpassword
      MYSQL_DATABASE: Ascent
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```
