FROM nginx 

RUN rm /etc/nginx/conf.d/default.conf

ADD default.conf /etc/nginx/conf.d/

ADD nginx.conf /etc/nginx/nginx.conf

COPY dist/  /usr/share/nginx/html/ 
