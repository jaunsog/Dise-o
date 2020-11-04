#!/bin/bash
sudo su
cd Dise-o
echo 'Verificando cambios'
git pull origin master 
echo 'Up to date'
cd ServerProyect
node index.js
