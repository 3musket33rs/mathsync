build:
	make build -C library
	make build -C integrations

test: build
	echo "Not yet implemented - bundle exec cucumber"
