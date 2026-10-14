#!/bin/bash
# ====================================================================
# Script de Despliegue Automatizado para PRACNET en AWS EC2 (Ubuntu 24.04)
# ====================================================================

echo ">> Actualizando repositorios del sistema..."
sudo apt update && sudo apt upgrade -y

echo ">> Instalando Python3, pip, venv y Nginx..."
sudo apt install -y python3 python3-pip python3-venv nginx git certbot python3-certbot-nginx

echo ">> Creando entorno virtual..."
python3 -m venv venv
source venv/bin/activate

echo ">> Instalando dependencias del proyecto..."
pip install -r requirements.txt

echo ">> Poblando base de datos inicial..."
python -m app.seed_data

echo ">> Configurando servicio systemd para PRACNET..."
sudo bash -c 'cat > /etc/systemd/system/pracnet.service <<EOF
[Unit]
Description=Servicio Gunicorn para PRACNET USM
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/Pracnet
ExecStart=/home/ubuntu/Pracnet/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:5000 run:app
Restart=always

[Install]
WantedBy=multi-user.target
EOF'

sudo systemctl daemon-reload
sudo systemctl start pracnet
sudo systemctl enable pracnet

echo ">> Configurando Nginx como Reverse Proxy..."
sudo bash -c 'cat > /etc/nginx/sites-available/pracnet <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF'

sudo ln -sf /etc/nginx/sites-available/pracnet /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

echo ">> ¡PRACNET desplegado con éxito en AWS EC2!"
