# 🌟 Pokemon API Explorer

This project is built with [Vue 3](https://vuejs.org/) and [Vuetify](https://next.vuetifyjs.com/), designed to offer a modern, accessible, and fully responsive user interface.

## 📦 Main Technologies

- ⚙️ [Vue 3](https://vuejs.org/) (Composition API)
- 🎨 [Vuetify 3](https://next.vuetifyjs.com/) (Material Design Framework)
- 🛠️ Vite / Webpack
- 🔍 Vue Query para consumo de API
- 📦 Material Design Icons (MDI)

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/DanisonEdiel/diagnostic-test.git
cd diagnostic-test

# Install dependencies
npm install
```

## 🧪 Available Scripts

```bash
# Run the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview

# Lint the code (if configured)
npm run lint
```

## 🚀 Despliegue en AWS EC2

### Requisitos Previos

- Una instancia EC2 de AWS con Amazon Linux 2 o Ubuntu
- Docker y Docker Compose instalados en la instancia
- Acceso SSH a la instancia EC2

### Pasos para el Despliegue

1. **Conectarse a la instancia EC2 mediante SSH**

```sh
ssh -i "tu-clave.pem" ec2-user@tu-instancia-ec2.amazonaws.com
```

2. **Instalar Docker y Docker Compose (si no están instalados)**

Para Amazon Linux 2:
```sh
sudo yum update -y
sudo amazon-linux-extras install docker -y
sudo service docker start
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

Para Ubuntu:
```sh
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable --now docker
sudo usermod -aG docker ubuntu
sudo apt install -y docker-compose
```

3. **Clonar el repositorio en la instancia EC2**

```sh
git clone https://github.com/DanisonEdiel/diagnostic-test.git app
cd app
```

4. **Construir y ejecutar la aplicación con Docker Compose**

```sh
docker-compose up -d --build
```

5. **Verificar que la aplicación esté funcionando**

Accede a tu instancia EC2 a través de su IP pública o DNS en el navegador:
```
http://tu-instancia-ec2.amazonaws.com
```

## 📁 Project Structure

```
src/
├── assets/          # Static files like images or styles
├── components/      # Reusable Vue components
├── composables/     # Reusable logic using the Composition API
├── layouts/         # App layouts (optional)
├── pages/           # Main views or routes (if using Vue Router)
├── plugins/         # Global configuration (Vuetify, Axios, etc.)
├── router/          # Application routes
├── store/           # Pinia or Vuex (if used)
├── App.vue          # Root component
└── main.ts          # Application entry point
```

## ✨ Features

- ⚡ Fast and modular rendering with Vite
- 📱 Fully responsive design
- 📡 API consumption using Axios or Vue Query

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/f3319e64-d900-4cfb-adee-babadeb5e3c2)



## 📬 Contact

Made with ❤️ by [Edison Llano (DanisonEdiel)](https://github.com/DanisonEdiel).

- 🌐 LinkedIn: [Edison Llano](https://www.linkedin.com/in/edison-daniel-llano-tapia-3859aa260/)
- 📧 Email: edllanot@uce.edu.ec or edi282000@gmail.com
- 🐙 GitHub: [DanisonEdiel](https://github.com/DanisonEdiel)
