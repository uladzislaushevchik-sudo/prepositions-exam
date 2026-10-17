# Автоотправка результатов в Google Таблицу

## 1. Создайте таблицу
Создайте Google Sheet: **Prepositions Exam Results**

Первая строка (заголовки):
```
timestamp | name | group | pct | correct | total | pass | time | place | direction | transport | details_json
```

## 2. Apps Script
1. В таблице: **Расширения → Apps Script**
2. Вставьте код из файла `Prepositions_Exam_AppsScript.js` (в проекте)
3. **Развернуть → Новое развёртывание → Веб-приложение**
   - Выполнять от имени: **Меня**
   - Доступ: **Все** (Anyone)
4. Скопируйте URL вида `https://script.google.com/macros/s/..../exec`

## 3. Подключите к экзамену
1. Откройте экзамен
2. **Кабинет преподавателя**
3. Вставьте URL → **Сохранить webhook**

После этого каждая сдача автоматически уходит в таблицу.

## Тест
В редакторе Apps Script выполните функцию `testPost` — в таблице должна появиться тестовая строка.
