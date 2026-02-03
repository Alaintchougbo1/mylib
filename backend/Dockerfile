FROM php:8.2-fpm

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    curl \
    && docker-php-ext-install \
    pdo \
    pdo_mysql \
    zip \
    intl \
    opcache

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Installation du CLI Symfony
RUN curl -sS https://get.symfony.com/cli/installer | bash && \
    mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

# Configuration du répertoire de travail
WORKDIR /var/www/html

# Copie des fichiers du projet
COPY . .

# Installation des dépendances PHP (si composer.json existe)
RUN if [ -f composer.json ]; then composer install --no-interaction --optimize-autoloader; fi

# Exposition du port
EXPOSE 8000

# Commande par défaut
CMD ["symfony", "server:start", "--no-tls", "--port=8000", "--allow-all-ip"]
