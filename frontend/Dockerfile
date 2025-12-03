FROM node:20-alpine

WORKDIR /frontend

COPY . .

RUN npm install

ENV PORT=8000
EXPOSE 8000

CMD ["npm", "run", "dev"]
