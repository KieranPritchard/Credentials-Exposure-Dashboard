# 1. Production PHP dependencies
FROM composer:2 AS vendor

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts


# 2. Test suite (build fails if tests fail)
FROM php:8.4-cli-alpine AS test

RUN apk add --no-cache postgresql-dev \
    && docker-php-ext-install pdo_pgsql pgsql \
    && apk del postgresql-dev \
    && apk add --no-cache libpq unzip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --no-scripts

COPY . .

# Run your test suite (this will cause the build/container execution to fail if tests fail)
RUN touch .env && php artisan test

CMD ["php", "artisan", "test"]

# 3. Final runtime image
FROM php:8.4-cli-alpine AS production

LABEL authors="kieranpritchard"

RUN apk add --no-cache postgresql-dev \
    && docker-php-ext-install pdo_pgsql pgsql \
    && apk del postgresql-dev \
    && apk add --no-cache libpq

WORKDIR /var/www/html

COPY . .
COPY --from=vendor /app/vendor ./vendor

# --no-scripts skipped package discovery, so do it here.
# Folders are listed out because Alpine's sh has no brace expansion.
RUN rm -f bootstrap/cache/*.php \
    && php artisan package:discover --ansi \
    && mkdir -p storage/framework/cache storage/framework/sessions \
                storage/framework/views storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# Forces the test stage to run before this image can finish building
COPY --from=test /app/composer.json ./tests-passed.flag
RUN rm ./tests-passed.flag

ENV PHP_CLI_SERVER_WORKERS=4
EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]