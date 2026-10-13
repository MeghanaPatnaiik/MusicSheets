
FROM node:20-slim

WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package*.json ./

RUN npm ci --include=optional

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
