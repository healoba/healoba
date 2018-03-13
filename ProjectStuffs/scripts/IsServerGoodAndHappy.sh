responseCode=$(curl --write-out %{http_code} --silent --output /dev/null http://healoba.com/fa/home)
wait
if [ $responseCode -eq 502 ] || [ $responseCode -eq 500 ] ;
then
	reboot
fi