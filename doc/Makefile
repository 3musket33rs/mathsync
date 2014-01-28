git_url = $(shell git config --get remote.origin.url)

init:
	test -d docsite || git clone -b gh-pages $(git_url) docsite

build:
	cd docsite && git rm -rf .
	cp -R src/* docsite
	cp -R ../java/core/target/apidocs docsite/javadoc
	cp -R ../javascript/core/apidocs docsite/jsdoc
	cd docsite && git add .

deploy:
	cd docsite && git commit -m "Update documentation" && git push
