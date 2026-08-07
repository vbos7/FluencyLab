FROM php:8.4-apache

# Habilita a extensão PDO + MySQL (necessária para conectar ao banco)
RUN docker-php-ext-install pdo_mysql

# Permite que o Apache siga links simbólicos e leia .htaccess
RUN a2enmod rewrite

EXPOSE 80
