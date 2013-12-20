init:
	make init -C javascript

build:
	make build -C java
	make build -C javascript

test: build
	echo "Not yet implemented - bundle exec cucumber"

deploy:
	make deploy -C java
	make deploy -C javascript

set-dev-version:
	make set-dev-version -C java
	make set-dev-version -C javascript

set-release-version:
	make set-release-version -C java
	make set-release-version -C javascript
