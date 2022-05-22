FROM ubuntu:20.04

# Installing NAGIOS Core

ENV TZ=Europe/Lisbon
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update
RUN apt-get install -y autoconf gcc libc6 make wget unzip apache2 php libapache2-mod-php7.4 libgd-dev inetutils-ping
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

# Installing NAGIOS Plugins

RUN apt-get install -y autoconf gcc libc6 libmcrypt-dev make libssl-dev wget bc gawk dc build-essential snmp libnet-snmp-perl gettext

WORKDIR /tmp
RUN wget --no-check-certificate -O nagios-plugins.tar.gz https://github.com/nagios-plugins/nagios-plugins/archive/release-2.3.3.tar.gz
RUN tar zxf nagios-plugins.tar.gz

WORKDIR /tmp/nagios-plugins-release-2.3.3/
RUN ./tools/setup
RUN ./configure
RUN make
RUN make install

# Configuring NAGIOS

RUN apt-get install -y systemctl

# generated with htpasswd -cb /usr/local/nagios/etc/htpasswd.users <username> <passwd>
COPY ./htpasswd.users /usr/local/nagios/etc/htpasswd.users

COPY ./nagios.cfg /usr/local/nagios/etc/nagios.cfg
COPY ./uni4all.cfg /usr/local/nagios/etc/objects/uni4all.cfg
COPY ./monitoring.cfg /usr/local/nagios/etc/objects/monitoring.cfg

EXPOSE 80

CMD [ "systemctl", "start", "apache2.service", "nagios.service" ]
