FROM node:20-bookworm

RUN apt-get update && apt-get install -y python3-pip python3-venv 

RUN python3 -m venv /venv

RUN /venv/bin/pip install --upgrade pip

RUN /venv/bin/pip install --no-cache-dir linkchecker==10.0.1

RUN mkdir -p /usr/src/garie-plugin
RUN mkdir -p /usr/src/garie-plugin/reports

WORKDIR /usr/src/garie-plugin

COPY package.json .

RUN cd /usr/src/garie-plugin && npm install

RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64.deb && \
    dpkg -i dumb-init_*.deb

COPY . .

ENV PATH="/venv/bin:$PATH"

EXPOSE 3000

VOLUME ["/usr/src/garie-plugin/reports"]

ENTRYPOINT ["/usr/src/garie-plugin/docker-entrypoint.sh"]

CMD ["/usr/bin/dumb-init", "npm", "start"]
