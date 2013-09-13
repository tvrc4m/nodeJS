cat /var/log/nginx/www.fastty.log |awk -F '/detail/' '{print $2}' |awk -F/ '{if($1)print $1;}'| awk '{print $1}' >> /var/log/nginx/baidu_detail.log
