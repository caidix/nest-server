1. 安装docker
https://www.docker.com/get-started/


docker pull mysql:5.7

docker images

docker run --name mysql -e MYSQL_ROOT_PASSWORD=123456 -d -i -p 3306:3306 mysql

docker exec -it mysql bash

mysql -u root -p

CREATE USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456'; 