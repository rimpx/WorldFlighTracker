FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copia i sorgenti Vue
COPY . .

# Compila il frontend
RUN npm run build


EXPOSE 8080


CMD ["npm", "run", "serve"]