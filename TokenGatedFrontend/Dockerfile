FROM --platform=linux/amd64 node:18
WORKDIR /usr/src/app
COPY . .
RUN npm install
ENV REACT_APP_MAGIC_KEY=pk_live_CFE63A142D3C37A0
#ENV GENERATE_SOURCEMAP=false
ENV REACT_APP_DEV=production
ENV REACT_APP_INFURA_KEY=8de646adb3764bb7bbbfd0d367228ccb
ENV REACT_APP_WC_APP_ID=6cd044e7144cd9a4006bbabd227cdcd1
ENV REACT_APP_ALCHEMY_API_KEY=z8qocrWtyyFzTFcex9x1Joh5fQh7RaGc
ENV REACT_APP_API_HOST_URL=https://apiv2dev.projectvenkman.com
ENV NODE_OPTIONS --openssl-legacy-provider
ENV NODE_OPTIONS --max-old-space-size=8192
RUN npx tailwindcss -i ./src/styles/App.css -o ./src/styles/output.css
RUN npx craco build
EXPOSE 3000
CMD [ "npx", "serve", "-s", "build" ]
