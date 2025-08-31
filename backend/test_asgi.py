#!/usr/bin/env python
"""
Тест ASGI конфигурации
"""
import os
import sys
import django

# Добавляем путь к проекту
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Настраиваем Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Импортируем ASGI приложение
from backend.asgi import application

print("✅ ASGI приложение загружено успешно")
print(f"Тип приложения: {type(application)}")

# Проверяем, что это ProtocolTypeRouter
from channels.routing import ProtocolTypeRouter
if isinstance(application, ProtocolTypeRouter):
    print("✅ Приложение является ProtocolTypeRouter")
    print(f"Доступные протоколы: {list(application.application_mapping.keys())}")
else:
    print("❌ Приложение НЕ является ProtocolTypeRouter")
