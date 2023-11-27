FROM node:18.15.0-alpine3.16

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

# Copy all files allowed by .dockerignore
COPY . /

# Install dependencies, omitting development dependencies
ENV NODE_OPTIONS="--dns-result-order=ipv4first"

RUN npm install --omit=dev --no-progress --no-update-notifier

ENTRYPOINT ["/entrypoint.sh"]
