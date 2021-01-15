
# Оглавление

-  [Что это?](#what)
-  [Как начать?](#start)
-  [Команды Gulp](#gulp)
-  [Структура проекта](#structure)

# <a id="what" /> Что это?

Шаблон для последующей посадки его на WordPress

# <a id="start" /> Как начать?

Ниже будет список git-команд для разработки

### Клонирование репозитория

    $ git clone https://github.com/rybkinevg/nkohub-template.git

> для доступа по **HTTPS**

    $ git clone git@github.com:rybkinevg/nkohub-template.git

> для доступа по **SSH**

### Обновление репозитория

    $ git pull

### Внесение изменений в репозиторий

    $ git add .

    $ git commit -m "[что было сделано]"

    $ git push

### Создание новой ветки в инициализированном репозитории

Создание ветки и переход на созданную ветку

    $ git branch [название ветки]
    $ git checkout [название ветки]

Таже самая команда, только одной строкой

    $ git checkout -b [название ветки]

### Объединение веток

    $ git checkout [название ветки в которую (!) нужно объединить]

    $ git merge [название ветки которую (!) нужно слить с текущей]

    $ git push

# <a id="gulp" /> Команды Gulp

Ниже будет список команд Gulp для запуска сборки

### Скачивание необходимых пакетов

Команда для первого запуска сборки, когда ещё не установлены все необходимые зависимости **node_modules**

    $ npm i

### Разработка

Команда запуска сборки для разработки

    $ gulp

### Если есть ошибка при вызове

Ошибка при вызове

    $ gulp
    command not found

Скорее всего, ошибка в том, что не установлен **gulp-cli**. Хоть он и прописан в package.json, его необходимо установить глобально.

    $ npm install -g gulp-cli

После его установки должна заработать команда

    $ gulp

### Продакшн

Команда запуска сборки для продакшена, включает в себя минификацию скриптов, стилей, картинок, разметки и отсутствие map файлов

    $ gulp build

### Удаление продакш папки

Команда удаляет продакш папку

    $ gulp clean

### Кэш

Команда запуска сборки для продакшена с избеганием кэширования (не нужно будет вручную сбрасывать кэш)

    $ gulp build
    $ gulp cache

### Выгрузка на хостинг

Команда для выгрузки продакшен сборки на хостинг

    $ gulp build
    $ gulp deploy

### Остановка работы BrowserSync

Сочетание клавиш

    CTRL + C

# <a id="structure" /> Структура проекта

Обязательные папки помечены **жирным шрифтом**

### Списочная структура

- app (папка сборки)
- **dist** (папка разработки)
  - **assets** (все подпапки также обязательные)
    - fonts (шрифты)
    - img (картинки)
      - svg (svg файлы)
    - js (скрипты)
      - main.js (точка входа скриптов)
    - sass (sass файлы)
      - main.sass (точка входа sass файлов)
  - html (html фрагменты)
  - resources (дополнительные файлы, не используемые в сборке)
  - **index.html** (точка входа html)
- node_modules (папка с необхимомыми для работы галпа файлами)

### Консольная структура

    nkohub-template
    │
    ├─── app
    ├─┬─ dist
    │ ├─┬─ assets
    │ │ ├─── fonts
    │ │ ├─┬─ img
    │ │ │ └── svg
    │ │ ├─┬─ js
    │ │ │ └── main.js
    │ │ └─┬─ sass
    │ │   └── main.sass
    │ ├─── html
    │ ├─── resources
    │ └─── index.html
    └─── node_modules