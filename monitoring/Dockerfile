FROM ubuntu:20.04

RUN dpkg -l selinux*

ENV TZ=Europe/Lisbon
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update
RUN apt-get install -y autoconf gcc libc6 make wget unzip apache2 php libapache2-mod-php7.4 libgd-dev
RUN apt-get install -y openssl libssl-dev

WORKDIR /tmp
RUN wget -O nagioscore.tar.gz https://github.com/NagiosEnterprises/nagioscore/archive/nagios-4.4.6.tar.gz
RUN tar xzf nagioscore.tar.gz

WORKDIR /tmp/nagioscore-nagios-4.4.6/
RUN ./configure --with-httpd-conf=/etc/apache2/sites-enabled
RUN make all

RUN make install-groups-users
RUN usermod -a -G nagios www-data

RUN make install

RUN make install-daemoninit
RUN make install-commandmode
RUN make install-config

RUN make install-webconf
RUN a2enmod rewrite
RUN a2enmod cgi

RUN apt-get install -y ufw

RUN ufw allow Apache
RUN ufw reload

RUN htpasswd -c /usr/local/nagios/etc/htpasswd.users nagiosadmin

RUN apt-get install -y systemctl

RUN systemctl restart apache2.service
RUN systemctl start nagios.service

EXPOSE 80

CMD [ "systemctl", "start", "apache2.service", "nagios.service" ]
