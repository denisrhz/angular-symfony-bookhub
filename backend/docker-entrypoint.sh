#!/bin/sh
set -e

cd /var/www/html

if [ ! -d "vendor" ]; then
    composer install --no-interaction --optimize-autoloader
fi

FIRST_RUN=false
if [ ! -f "var/data.db" ]; then
    FIRST_RUN=true
fi

mkdir -p var
chmod -R 777 var

php bin/console doctrine:migrations:migrate --no-interaction

if [ "$FIRST_RUN" = true ]; then
    php bin/console doctrine:fixtures:load --no-interaction --append
fi

exec "$@"