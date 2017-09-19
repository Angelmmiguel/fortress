FROM bitnami/node:8.4.0-r1
MAINTAINER Angel M <angel@laux.es>

# Required for Yarn
RUN install_packages apt-transport-https vim

# Install Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list && \
    install_packages yarn

# Cache dependencies
COPY package.json yarn.lock /app/
COPY client/package.json client/yarn.lock /app/client/
RUN yarn install && cd /app/client && yarn install

CMD ['yarn', 'start']
