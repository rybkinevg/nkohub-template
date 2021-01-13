# Оглавление

 - [Что это?](#what)
 - [Как начать?](#start)

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

    $ git checkout -b [название ветки]

### Объединение веток

    $ git checkout [название ветки в которую нужно объединить]
    $ git merge [название ветки которую нужно слить с текущей]
    $ git push