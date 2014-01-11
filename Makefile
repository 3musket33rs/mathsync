init:
	make init -C javascript
	make init -C features/support
	make init -C doc

build:
	make build -C java
	make build -C javascript
	make build -C doc

test: build
	echo "Not yet implemented - bundle exec cucumber"

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
