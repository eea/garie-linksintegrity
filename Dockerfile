FROM node:8.10.0

#ADD ./package.json /tmp/package.json
ADD . /app
#ADD ./garie-plugin /garie-plugin

RUN cd /app && npm install


CMD ["npm", "start"]
