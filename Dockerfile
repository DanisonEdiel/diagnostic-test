FROM node:20-alpine as build-stage

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto de archivos del proyecto
COPY . .

# Configurar variables de entorno para la compilación
ARG VUE_APP_API_URL
ENV VUE_APP_API_URL=${VUE_APP_API_URL}

# Construir la aplicación para producción
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine as production-stage

# Instalar gettext para envsubst (reemplazo de variables)
RUN apk add --no-cache gettext

# Copiar archivos de configuración de nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.template

# Exponer puerto 80
EXPOSE 80

# Variables de entorno para la configuración de nginx
ENV BACKEND_API_URL=http://localhost:8080/api/

# Script de inicio para reemplazar variables y arrancar nginx
CMD ["sh", "-c", "envsubst < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
