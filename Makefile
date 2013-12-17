build:
	make build -C java
	make build -C javascript/core

test: build
	echo "Not yet implemented - bundle exec cucumber"

deploy:
  make deploy -C javascript/core

set-dev-version:
	make set-dev-version -C java
	make set-dev-version -C javascript/core

set-release-version:
	make set-release-version -C java
	make set-release-version -C javascript/core
