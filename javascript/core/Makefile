init:
	npm install .

build:
	node --harmony `which gulp`

deploy: build
	npm shrinkwrap
	npm publish .
	rm npm-shrinkwrap.json

set-dev-version:
	npm version $(VERSION)-alpha

set-release-version:
	npm version $(VERSION)
