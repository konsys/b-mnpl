docker run --name testsql -e MYSQL_ROOT_PASSWORD=game  -p 3306:3306  -d mysql:8.0.1
# root / mypass123
#  docker pull phpmyadmin/phpmyadmin:latest

docker run --name my-own-phpmyadmin -d --link testsql:db -p 8081:80 phpmyadmin/phpmyadmin
docker ps -a

# http://localhost:8081