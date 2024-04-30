from pathlib import Path
from datetime import timedelta
import os
import environ

# Çevresel değişkenleri okuyacak .env dosyası
env = environ.Env()
environ.Env.read_env(env_file='.env')

POSTGRES_DB = env('POSTGRES_DB')
POSTGRES_USER = env('POSTGRES_USER')
POSTGRES_PASSWORD = env('POSTGRES_PASSWORD')
SECRET_KEY = env('SECRET_KEY')
EMAILHOST_PASSWORD = env('EMAILHOST_PASSWORD')
SECRET_42_ID = env('CLIENT_42_SECRET_ID')

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
ALLOWED_HOSTS = ['*']

#Email send two factor authentication
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com' # Eğer Gmail kullanıyorsanız
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = 'transcendenceecole42@gmail.com'
EMAIL_HOST_PASSWORD = EMAILHOST_PASSWORD
# EMAIL_HOST_PASSWORD = 'vuyh nnih kwhy ljnv'

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
        'DIRS': [BASE_DIR / 'templates'],
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
        'ENGINE'    : 'django.db.backends.postgresql',
        'NAME'      : POSTGRES_DB,
        'USER'      : POSTGRES_USER,
        'PASSWORD'  : POSTGRES_PASSWORD,
        'HOST'      : 'db',
        'PORT'      : 5432,
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

MEDIA_URL = 'https://localhost/media/'
MEDIA_ROOT = os.path.join(BASE_DIR,'media')


STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'public'),]

DEFAULT_USER_AVATAR = '/images/user.png'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'ping_pong.User'

# CORS_ALLOWED_ORIGINS = [
#     # 'http://localhost:63342',
#     # 'http://localhost:8080',
#     'http://localhost:3000',
#     'http://localhost:63342',
#     'https://localhost:8080',
# ]

CORS_ALLOW_ALL_ORIGINS = True

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
CLIENT_ID_42 = 'u-s4t2ud-052c281485c3d61fd33a1aac8c4e4e06a46fe52850875aa261a9a06d98911820'
CLIENT_SECRET_42 = SECRET_42_ID
REDIRECT_URI_42 = 'https://localhost:443'