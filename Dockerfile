FROM node:10.19.0
WORKDIR /
ADD . /

EXPOSE 5000

#RUN npm cache clean --force
#RUN npm cache verify
#RUN rm -rf node_modules package-lock.json
RUN npm install
RUN npm run build
RUN rm -rf node_modules package-lock.json
RUN npm install -g serve
ENTRYPOINT serve -s build 