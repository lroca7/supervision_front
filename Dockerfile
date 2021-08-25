FROM node:10.19.0
WORKDIR /
ADD . /

EXPOSE 5000
RUN rm -rf node_modules
RUN npm install
RUN npm run build
RUN rm -rf node_modules
RUN npm install -g serve
ENTRYPOINT serve -s build 