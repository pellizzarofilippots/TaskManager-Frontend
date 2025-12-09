# Stage 1: Build Angular app
FROM node:20-alpine AS build
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il resto del progetto
COPY . .

# Build dell'app per produzione
RUN npm run build --prod

# Stage 2: Serve con Nginx
FROM nginx:alpine
# Copia la build nella cartella di Nginx
COPY --from=build /app/dist/<nome-app> /usr/share/nginx/html

# Esponi la porta 80
EXPOSE 80

# Avvia Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
