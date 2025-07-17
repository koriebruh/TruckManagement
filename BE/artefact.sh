
docker-compose up -d --build

docker exec -i mysql-db mysql -u korie -pkorie123 truck_management < seedingCity.sql