FROM --platform=linux/amd64 node:18
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/server.js"]
#CMD ["npx", "ts-node", "src/server.ts"]
