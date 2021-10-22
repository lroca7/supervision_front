# Construir Imagen Docker

--------- AJUSTAR CONFIGURACIONES -----------
* src\configs\themeConfig.js se configura que tenga menu y barra superior
* src\contants.js se configura endpoint de microservicios backend

------
* Ruta servidor /opt/git/supervision_front

```
docker build . -t supervision_front
docker run --rm -d -p 5000:5000 --name supervision-app supervision_front
```

# Publicar Imagen
```
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 503553001946.dkr.ecr.us-east-1.amazonaws.com
docker build -t supervision_front .
docker push 503553001946.dkr.ecr.us-east-1.amazonaws.com/supervision_front:latest
docker tag supervision_front:latest 503553001946.dkr.ecr.us-east-1.amazonaws.com/supervision_front:latest

docker pull 503553001946.dkr.ecr.us-east-1.amazonaws.com/supervision_front:latest
docker run --rm -d -p 5000:5000 --name supervision-app 503553001946.dkr.ecr.us-east-1.amazonaws.com/supervision_front

```

# Detener contenedor
```
docker stop supervision-app
```

* Limpiar imagenes que no estan en ejecucion: "docker rmi -f $(docker images -a -q)"

# Comandos git
https://desarrolloweb.com/articulos/trabajar-ramas-git.html
git branch
git show-branch
git checkout dev
