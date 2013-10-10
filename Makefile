build:
	make build -C library
	make build -C integrations

test: build
	echo "Not yet implemented - bundle exec cucumber"

set-dev-version:
	make set-dev-version -C library

set-release-version:
	make set-release-version -C library
