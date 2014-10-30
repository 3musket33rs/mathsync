init:
	npm install .
	make init -C node-generator
	make init -C browser
	make init -C java-webapp
	make init -C java-nodep-webapp

build:
	env CLIENT=node-generator SERVER=node-generator npm test
	env CLIENT=node-generator SERVER=java-webapp npm test
	env CLIENT=node-generator SERVER=java-nodep-webapp npm test
	env CLIENT=browser SERVER=node-generator npm test
	env CLIENT=browser SERVER=java-webapp npm test

set-dev-version:
	make set-dev-version -C java-webapp
	make set-dev-version -C java-nodep-webapp

set-release-version:
	make set-release-version -C java-webapp
	make set-release-version -C java-nodep-webapp
