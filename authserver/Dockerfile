FROM node:20-alpine

WORKDIR /authserver

COPY . .

RUN npm install

ENV PORT=8002
EXPOSE 8002

CMD ["npm", "run", "dev"]
