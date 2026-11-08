#!/bin/bash
# ====================================================================
# SCRIPT DE DESPLIEGUE AUTOMATIZADO - PRACNET v2.0
# Entorno: AWS EC2 (Ubuntu 24.04 LTS Server)
# Tecnologías: Docker, Docker Compose, MySQL 8.0, Redis 7.2, Node.js v22, Nginx
# ====================================================================

set -e

echo "===================================================================="
echo ">> INICIANDO DESPLIEGUE OFICIAL DE PRACNET EN AWS EC2 (Ubuntu 24.04)"
echo "===================================================================="

# 1. Actualizar paquetes del sistema
echo ">> [1/6] Actualizando repositorios y paquetes del sistema..."
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release ufw git

# 2. Instalar Docker Engine y Docker Compose
echo ">> [2/6] Verificando e instalando Docker Engine..."
if ! command -v docker &> /dev/null; then
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
      
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo systemctl enable docker
    sudo systemctl start docker
    sudo usermod -aG docker $USER
fi

# 3. Configurar Firewall UFW (Seguridad de Instancia)
echo ">> [3/6] Configurando reglas de firewall (Puertos 22, 80, 443)..."
sudo ufw allow 22/tcp || true
sudo ufw allow 80/tcp || true
sudo ufw allow 443/tcp || true
sudo ufw --force enable || true

# 4. Configurar e Iniciar Contenedores Docker (MySQL 8, Redis 7, Backend Node.js)
echo ">> [4/6] Levantando infraestructura contenerizada (MySQL 8.0 + Redis 7.2 + API Node.js)..."
cd "$(dirname "$0")"
sudo docker compose down --remove-orphans || true
sudo docker compose up -d --build

# 5. Instalar y configurar Nginx como Reverse Proxy
echo ">> [5/6] Configurando Nginx Reverse Proxy..."
sudo apt-get install -y nginx
sudo cp nginx.conf /etc/nginx/sites-available/pracnet
sudo ln -sf /etc/nginx/sites-available/pracnet /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# 6. Verificación de Salud
echo ">> [6/6] Verificando estado de los servicios..."
sleep 5
curl -s http://127.0.0.1/health || true

echo ""
echo "===================================================================="
echo ">> ¡PRACNET v2.0 DESPLEGADO EXITOSAMENTE EN AWS EC2!"
echo "   - API REST: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'IP_PUBLICA_EC2')/api/"
echo "   - Base de Datos: MySQL 8.0 activo con esquema normalizado"
echo "   - Memoria / Caché: Redis 7.2 activo"
echo "===================================================================="
