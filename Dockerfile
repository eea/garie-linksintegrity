FROM node:8.10.0

RUN mkdir -p /usr/src/garie-linksintegrity

WORKDIR /usr/src/garie-linksintegrity

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000


RUN chmod +x /usr/src/garie-linksintegrity/docker-entrypoint.sh

ENTRYPOINT ["/usr/src/garie-linksintegrity/docker-entrypoint.sh"]

CMD ["npm", "start"]
