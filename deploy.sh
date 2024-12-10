#! /bin/bash
PROD_HOST="c1.haxor.no"
PROD_USER="stanley"
PROJECT_ROOT="/var/www/www.haxor.no"

if [[ `hostname` == $PROD_HOST && `whoami` == $PROD_USER && `pwd` == $PROJECT_ROOT ]]; then
    git pull origin prod
    sudo chown -R www-data:www-data .
    sudo -u www-data php8.2 /usr/bin/composer install
    sudo -u www-data php8.2 craft up
else
    echo "Error: Incorrect host, user, or directory."
fi
