#!/bin/bash

# Script para actualizar la aplicación en EC2
# Uso: ./update-ec2.sh usuario@tu-instancia-ec2.amazonaws.com

if [ -z "$1" ]; then
  echo "Por favor proporciona la dirección SSH de tu instancia EC2"
  echo "Ejemplo: ./update-ec2.sh ec2-user@ec2-12-345-67-890.compute-1.amazonaws.com"
  exit 1
fi

EC2_SSH=$1

# Copiar la configuración actualizada de nginx
echo "Copiando configuración de nginx a la instancia EC2..."
scp nginx.conf $EC2_SSH:~/nginx.conf

# Ejecutar comandos en la instancia EC2
ssh $EC2_SSH << 'EOF'
  # Copiar la configuración de nginx al contenedor
  echo "Actualizando la configuración de nginx en el contenedor..."
  
  # Obtener el ID del contenedor de nginx
  CONTAINER_ID=$(docker ps | grep nginx | awk '{print $1}')
  
  if [ -z "$CONTAINER_ID" ]; then
    echo "No se encontró ningún contenedor de nginx en ejecución"
    exit 1
  fi
  
  # Copiar la configuración al contenedor
  docker cp ~/nginx.conf $CONTAINER_ID:/etc/nginx/conf.d/default.conf
  
  # Recargar nginx
  echo "Recargando configuración de nginx..."
  docker exec $CONTAINER_ID nginx -s reload
  
  echo "¡Configuración actualizada con éxito!"
EOF

echo "Proceso completado. Verifica que tu aplicación ahora maneje correctamente las rutas."
