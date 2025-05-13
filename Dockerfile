# Etapa 1: Construcción
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VUE_APP_API_URL
ENV VUE_APP_API_URL=$VUE_APP_API_URL
RUN npm run build

# Etapa 2: Servir el contenido con Nginx
FROM nginx:alpine

# Instalar gettext para envsubst (reemplazo de variables)
RUN apk add --no-cache gettext

# Copiar archivos de la aplicación y configuración
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.template

# Exponer puerto 80
EXPOSE 80

# Variables de entorno para la configuración de nginx
ENV BACKEND_API_URL=http://orderlyheroku-67e3b0c6e00e.herokuapp.com/

# Script de inicio para reemplazar variables y arrancar nginx
CMD ["sh", "-c", "envsubst < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
