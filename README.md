docker build . -t supervision_front

docker run --rm -d --name supervision-app supervision_front