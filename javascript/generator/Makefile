install:
	npm install -g grunt-cli
	npm install .

build: install
	grunt
	npm test

deploy: build
	npm publish .

set-dev-version:
	npm version $(VERSION)-alpha

set-release-version:
	npm version $(VERSION)
