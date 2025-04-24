FROM node:18
WORKDIR /app
COPY ../package.json ./
COPY ../* ./
COPY ../prisma* ./prisma
RUN ls -l /app
RUN npm install && npx && npm install -g ts-node typescript
RUN npx prisma migrate dev --schema=/app/prisma/schema.prisma
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]
