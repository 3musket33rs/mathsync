init:
	gem install bundler
	bundle install
	make init -C javascript
	make init -C features/support
	make init -C doc

build:
	make build -C java
	make build -C javascript
	make build -C doc

testonly:
	env CLIENT=node-client SERVER=node-server bundle exec cucumber

test: build, testonly

deploy:
	make deploy -C java
	make deploy -C javascript
	make deploy -C doc

set-dev-version:
	make set-dev-version -C java
	make set-dev-version -C javascript

set-release-version:
	make set-release-version -C java
	make set-release-version -C javascript
