FROM node:4.0
MAINTAINER David McGaffin <david@codeship.com>

RUN curl https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
  echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list

RUN apt-get update && apt-get install -y \
  google-chrome-stable \
  unzip \
  xvfb

# Set up Chromedriver Environment variables
ENV CHROMEDRIVER_VERSION 2.19
ENV CHROMEDRIVER_DIR /chromedriver
RUN mkdir $CHROMEDRIVER_DIR

# Download and install Chromedriver
RUN wget -q --continue -P $CHROMEDRIVER_DIR "http://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip"
RUN unzip $CHROMEDRIVER_DIR/chromedriver* -d $CHROMEDRIVER_DIR

# Put Chromedriver into the PATH
ENV PATH $CHROMEDRIVER_DIR:$PATH
# ENV CHROME_BIN $CHROMEDRIVER_DIR/chromedriver

ENV DISPLAY :99
#### end chrome install

WORKDIR /app

ADD package.json ./package.json
RUN npm install
RUN npm install -g grunt-cli

ADD . ./
