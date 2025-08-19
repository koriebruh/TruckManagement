 docker-compose down --volumes --rmi all

docker logs truck-management

docker-compose up -d --build

#docker exec -i mysql-db mysql -u korie -pkorie123 truck_management < seedingCity.sql

mysqldump -u root -p --no-data truck_management > schema.sql

http://localhost:8080/swagger-ui/index.html