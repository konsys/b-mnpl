docker run --name testsql -e MYSQL_ROOT_PASSWORD=game  -p 3306:3306  -d mysql:8.0.1
# root / mypass123
#  docker pull phpmyadmin/phpmyadmin:latest

docker run --name my-own-phpmyadmin -d --link testsql:db -p 8081:80 phpmyadmin/phpmyadmin

docker run --name my-own-nats -d -p 4222:4222 nats:2.1.6

docker run --name my-own-pgadmin -d --link testsql:db -p 5050:5050 -e PGADMIN_DEFAULT_EMAIL=admin@admin.ru -e PGADMIN_DEFAULT_PASSWORD=smz dpage/pgadmin4:4.20

# docker ps -a

# http://localhost:8081

# netstat -ntlp | grep LISTEN

# mkdir postgres
# cd postgres

# docker volume create --driver local --name=pgvolume
# docker volume create --driver local --name=pga4volume

# docker network create --driver bridge pgnetwork

# cat << EOF > pg-env.list
# PG_MODE=primary
# PG_PRIMARY_USER=postgres
# PG_PRIMARY_PASSWORD=yoursecurepassword
# PG_DATABASE=testdb
# PG_USER=yourusername
# PG_PASSWORD=yoursecurepassword
# PG_ROOT_PASSWORD=yoursecurepassword
# PG_PRIMARY_PORT=5432
# EOF

cat << EOF > pgadmin-env.list
PGADMIN_SETUP_EMAIL=youremail@yourdomain.com
PGADMIN_SETUP_PASSWORD=yoursecurepassword
SERVER_PORT=5050
EOF

# docker run --publish 5432:5432 \
#   --volume=pgvolume:/pgdata \
#   --env-file=pg-env.list \
#   --name="postgres" \
#   --hostname="postgres" \
#   --network="pgnetwork" \
#   --detach \
# crunchydata/crunchy-postgres:centos7-10.9-2.4.1

  # --env-file=pgadmin-env.list \
docker run --publish 5050:5050 \
  --env-file=pgadmin-env.list \
  --volume=pga4volume:/var/lib/pgadmin \
  --name="pgadmin4" \
  --hostname="pgadmin4" \
  --network="pgnetwork" \
  --detach \
crunchydata/crunchy-pgadmin4:centos7-10.9-2.4.1