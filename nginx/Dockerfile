# Resmi Nginx imajını temel alarak başla
FROM nginx:latest
# Nginx yapılandırma dosyasını kopyala
# COPY ./cert/cert.pem /etc/ssl/cert.pem
# COPY ./cert/key.pem /etc/ssl/key.pem
RUN mkdir -p /etc/nginx/ssl
#COPY . /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/nginx.conf
