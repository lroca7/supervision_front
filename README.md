# Construir Imagen Docker

```
docker build . -t supervision_front
docker run --rm -d -p 5000:5000 --name supervision-app supervision_front
```

# Publicar Imagen
```
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 503553001946.dkr.ecr.us-east-1.amazonaws.com
docker build -t supervision_front .
docker push 503553001946.dkr.ecr.us-east-1.amazonaws.com/supervision_front:latest
docker push 503553001946.dkr.ecr.us-east-1.amazonaws.com/supervision_front:latestdocker push 503553001946.dkr.ecr.us-east-1.amazonaws.com/supervision_front:latest
```

# Detener contenedor
```
docker stop supervision-app
```