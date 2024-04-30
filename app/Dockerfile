# Resmi Node.js image'ını temel alarak başla
FROM node:16
# Çalışma dizinini belirle
WORKDIR /
# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./
# Projede kullanılan bağımlılıkları yükle
RUN npm install
# Uygulama kaynak kodunu kopyala
COPY . .
# Uygulamayı build et
RUN npm run build
# Uygulamayı başlat
CMD [ "npm", "start" ]