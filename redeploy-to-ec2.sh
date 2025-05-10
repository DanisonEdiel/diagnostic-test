#!/bin/bash

# Script para reconstruir y volver a desplegar la aplicación en EC2
# Uso: ./redeploy-to-ec2.sh usuario@tu-instancia-ec2.amazonaws.com

if [ -z "$1" ]; then
  echo "Por favor proporciona la dirección SSH de tu instancia EC2"
  echo "Ejemplo: ./redeploy-to-ec2.sh ec2-user@ec2-12-345-67-890.compute-1.amazonaws.com"
  exit 1
fi

EC2_SSH=$1

# Construir la imagen Docker localmente
echo "Construyendo la imagen Docker..."
docker build -t vue-pokemon-app .

# Guardar la imagen como un archivo tar
echo "Guardando la imagen Docker..."
docker save vue-pokemon-app > vue-pokemon-app.tar

# Copiar la imagen a la instancia EC2
echo "Copiando la imagen a la instancia EC2 (esto puede tardar un poco)..."
scp vue-pokemon-app.tar $EC2_SSH:~/vue-pokemon-app.tar

# Ejecutar comandos en la instancia EC2
ssh $EC2_SSH << 'EOF'
  # Cargar la imagen Docker
  echo "Cargando la imagen Docker en la instancia EC2..."
  docker load < ~/vue-pokemon-app.tar
  
  # Detener y eliminar el contenedor anterior si existe
  echo "Deteniendo el contenedor anterior si existe..."
  docker stop vue-frontend || true
  docker rm vue-frontend || true
  
  # Ejecutar el nuevo contenedor
  echo "Iniciando el nuevo contenedor..."
  docker run -d --name vue-frontend \
    -p 80:80 \
    -e BACKEND_API_URL=http://tu-backend-url/api/ \
    --restart always \
    vue-pokemon-app
  
  # Limpiar
  echo "Limpiando archivos temporales..."
  rm ~/vue-pokemon-app.tar
EOF

# Limpiar localmente
echo "Limpiando archivos temporales locales..."
rm vue-pokemon-app.tar

echo "¡Despliegue completado! Tu aplicación debería estar funcionando con la nueva configuración."
echo "Accede a tu instancia EC2 en http://tu-instancia-ec2.amazonaws.com"
echo "Recuerda reemplazar BACKEND_API_URL en el script con la URL real de tu backend."
