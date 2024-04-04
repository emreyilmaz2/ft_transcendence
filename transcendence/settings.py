from pathlib import Path
from datetime import timedelta
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-&b$8w-#+ocy+@c96!kx_z3*6n6o=kv(gjnv%6_1rpd^4my(6a_'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
ALLOWED_HOSTS = ['*']

#Email send two factor authentication
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com' # Eğer Gmail kullanıyorsanız
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = 'busemre999@gmail.com'
EMAIL_HOST_PASSWORD = 'ayra xksr olvm gbep'

# # SSL Certification Settings
# SECURE_SSL_REDIRECT = True
# SESSION_COOKIE_SECURE = True
# SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')  # Ön uç sunucunuz HTTPS'i belirten bir başlık ile sunucuya gelen bağlantıları sağlar
# # SSL Sertifikası ve Anahtarı
# SECURE_SSL_CERTIFICATE = '../cert.pem'
# SECURE_SSL_KEY = '../key.pem'


# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'ping_pong',
    'corsheaders',
]
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # 
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',  #
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'transcendence.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'transcendence.wsgi.application'

DATABASES = {
    'default':{
        'ENGINE': 'django.db.backends.postgresql',
        'NAME' : 'transcendence',
        'USER': 'postgres',
        'PASSWORD' : 'p123@sqd',
        'HOST': 'db',
        'PORT': 5432,
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
]

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

MEDIA_URL = 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR,'media')

STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'public'),]

DEFAULT_USER_AVATAR = '/images/user.png'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'ping_pong.User'

CORS_ALLOWED_ORIGINS = [
    'http://localhost:63342',
    'http://localhost:8080',
    'http://localhost:3000',
]

#Django Rest Framework JWT Authentication
CSRF_COOKIE_SECURE = False
CSRF_USE_SESSIONS = False

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "UPDATE_LAST_LOGIN": False,

    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": "",
    "AUDIENCE": None,
    "ISSUER": None,
    "JSON_ENCODER": None,
    "JWK_URL": None,
    "LEEWAY": 0,
}

# 42 OAuth ayarları
CLIENT_ID_42 = 'u-s4t2ud-262a8761a2528a18493301dcd0b753108abb14aaba5b7e6aee13fc117b072fc2'
CLIENT_SECRET_42 = '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'
REDIRECT_URI_42 = 'http://localhost:8080'