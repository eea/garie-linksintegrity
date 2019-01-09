FROM node:8.10.0

RUN apt-get update \
    && apt-get install -y --no-install-recommends python-pip python-dev \
    && mkdir /usr/src/linkchecker \
    && pip install virtualenv \
    && python -m virtualenv /usr/src/linkchecker \
    && /usr/src/linkchecker/bin/pip install git+https://github.com/linkcheck/linkchecker.git@master

RUN mkdir -p /usr/src/garie-linksintegrity

WORKDIR /usr/src/garie-linksintegrity

COPY package.json .

RUN cd /usr/src/garie-linksintegrity && npm install

COPY . .


EXPOSE 3000


CMD ["npm", "start"]
