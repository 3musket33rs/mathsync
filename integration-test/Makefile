init:
	npm install .
	make init -C node-generator
	make init -C java-webapp

build:
	env CLIENT=node-generator SERVER=node-generator npm test
	env CLIENT=node-generator SERVER=java-webapp npm test
