git_url = $(shell git config --get remote.origin.url)

init:
	git clone -b gh-pages $(git_url) docsite

build:
	cd docsite && git rm -r .
	cp -R src/* docsite
	cp -R ../java/core/target/apidocs docsite/javadoc

deploy:
	cd docsite && git add . && git commit -m "Update documentation" && git push
