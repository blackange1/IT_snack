# Help Django

## Підключення статичних файлів
### HTML шаблон
```html
{% load static %}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" type="text/css" href="{% static 'css/style.css' %}">
</head>
<body>
<script src="{% static 'js/main.js' %}"></script>
</body>
</html>
```
### settings.py
```python
STATICFILES_DIRS = [BASE_DIR.joinpath('static')]
```

## Налаштування шляху до папки шаблонів 
### settings.py
```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR.joinpath('templates')],
        'APP_DIRS': True,
        'OPTIONS': {'...'}
    }
```
