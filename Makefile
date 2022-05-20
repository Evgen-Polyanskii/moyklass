setup: prepare install data-load

prepare:
	cp -n .envExample .env || true

install:
	npm install

db-reset:
	dropdb moyklass || true
	createdb moyklass

data-load:
	psql moyklass < test.sql

start:
	npx nodemon server/bin/server.js

lint:
	npx eslint .

test:
	npm test

.PHONY: test
