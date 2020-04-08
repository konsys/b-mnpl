docker run --name testsql -e MYSQL_ROOT_PASSWORD=game  -p 3306:3306  -d mysql:8.0.1
# root / mypass123
#  docker pull phpmyadmin/phpmyadmin:latest

docker run --name my-own-phpmyadmin -d --link testsql:db -p 8081:80 phpmyadmin/phpmyadmin

docker run --name my-own-nats -d -p 4222:4222 nats:2.1.6
# docker ps -a

# http://localhost:8081

# netstat -ntlp | grep LISTEN