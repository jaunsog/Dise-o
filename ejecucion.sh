#!/bin/bash
sudo su
cd Dise-o
git pull origin master
cd ServerProyect
node index.js
echo 'Conectando'
