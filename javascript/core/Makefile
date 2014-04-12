init:
	npm install .

build:
	node --harmony `which gulp`

deploy: build
	npm publish .

set-dev-version:
	npm version $(VERSION)-alpha

set-release-version:
	npm version $(VERSION)
