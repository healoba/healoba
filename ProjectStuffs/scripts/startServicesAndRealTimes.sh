sudo systemctl restart redis
wait
sudo systemctl restart redis-server.service
wait
mongod --auth --port 27017 --dbpath=./database &> /dev/null &
#wait
cd files/stylesheet/
stylus -w stylus/main/ --out css/main/ &
stylus -w stylus/elements/ --out css/elements/ &
stylus -w stylus/pages/ --out css/pages/ &
stylus -w stylus/pages/encyclopedia/ --out css/pages/encyclopedia/ &
stylus -w stylus/pages/online_services/ --out css/pages/online_services/ &
stylus -w stylus/pages/panel/ --out css/pages/panel/ &