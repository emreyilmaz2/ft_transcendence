# Kullanmak istediğiniz Python sürümüne göre uygun base image'ı seçin
FROM python:3.9

# Uygulama dizinini oluşturun
WORKDIR /app

# Gerekli Python paketlerini yükleyin
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama kodlarını kopyalayın
COPY . /app

EXPOSE 8000
# Uygulamayı çalıştırın

# Script'i kopyalayın ve çalıştırılabilir yapın
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Script'i entrypoint olarak ayarlayın
ENTRYPOINT ["/entrypoint.sh"]

# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
