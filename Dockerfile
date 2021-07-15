FROM node:10.19.0
WORKDIR /
ADD . /

EXPOSE 5000
RUN npm install
RUN npm run build
RUN npm install -g serve
ENTRYPOINT serve -s build 