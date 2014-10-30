init:
	npm link ../core
	npm install .

build:
	echo Coming

deploy: build
	npm publish .

set-dev-version:
	npm version $(VERSION)-alpha
	npm install --save ../core
	npm uninstall mathsync
	npm link ../core

set-release-version:
	npm version $(VERSION)
	npm install --save ../core
	npm uninstall mathsync
	npm link ../core
