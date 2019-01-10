FROM node:8.10.0


RUN mkdir -p /usr/src/garie-linksintegrity 
RUN mkdir -p /usr/src/garie-linksintegrity/reports

WORKDIR /usr/src/garie-linksintegrity

COPY package.json .

RUN cd /usr/src/garie-linksintegrity && npm install

COPY . .

EXPOSE 3000

VOLUME ["/usr/src/garie-linksintegrity/reports", "/usr/src/garie-linksintegrity/logs"]

ENTRYPOINT ["/usr/src/garie-linksintegrity/docker-entrypoint.sh"]

CMD ["npm", "start"]
