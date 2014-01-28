init:
	npm link ../core
	npm install .

build:
	grunt
	npm test

deploy: build
	npm publish .

set-dev-version:
	npm version $(VERSION)-alpha

set-release-version:
	npm version $(VERSION)
