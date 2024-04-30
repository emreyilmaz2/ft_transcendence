#!/bin/sh

# Veritabanı hazır olana kadar bekle
# (Opsiyonel: Veritabanı bağlantısını kontrol etmek için bir döngü kullanabilirsiniz)

# Migration işlemlerini yap
python3 manage.py makemigrations app
python3 manage.py migrate

# Uygulamayı başlat
exec python manage.py runserver 0.0.0.0:8000
