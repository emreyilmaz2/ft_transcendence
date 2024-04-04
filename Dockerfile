FROM python:3.9
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

# Projedeki tüm dosyaları Docker imajına kopyala
COPY . .

# Uygulamanın çalıştırılacağı portu belirle (Django'nun varsayılan portu: 8000)
EXPOSE 8000
# Django uygulamasını çalıştır (Bu komut geliştirme ortamı için uygundur)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
