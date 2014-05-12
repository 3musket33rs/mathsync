#!/usr/bin/env bash

# Node with NVM
curl https://raw.github.com/creationix/nvm/master/install.sh | sh
source ~/.nvm/nvm.sh
nvm install 0.11
nvm alias default 0.11
echo 'export PATH=$PATH:node_modules/.bin' >> ~/.bashrc

# Maven
wget -O /tmp/maven.tar.gz http://mir2.ovh.net/ftp.apache.org/dist/maven/maven-3/3.1.1/binaries/apache-maven-3.1.1-bin.tar.gz
tar -zxv -f /tmp/maven.tar.gz
echo 'export M2_HOME=~/apache-maven-3.1.1' >> ~/.bashrc
echo 'export M2=$M2_HOME/bin' >> ~/.bashrc
echo 'export PATH=$M2:$PATH' >> ~/.bashrc
echo 'export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64/' >> ~/.bashrc
source ~/.bashrc
