fname="DBbak-$(date +"%Y-%m-%d-%T")"
wait
mkdir ~/healoba/ProjectStuffs/db_backups/"$fname"
wait
mongodump --host localhost:27017 -d health -u mlibre -p "M17511752gh@M17511752gh" -o ~/healoba/ProjectStuffs/db_backups/"$fname"
