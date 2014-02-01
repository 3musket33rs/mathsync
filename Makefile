init:
	make init -C javascript
	make init -C features/support
	make init -C doc
	make init -C integration-test

build:
	make build -C java
	make build -C javascript
	make build -C doc
	make build -C integration-test

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
