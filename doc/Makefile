git_url = $(shell git config --get remote.origin.url)

init:
	if [ -n "$(git_url)" ] ; then git clone -b gh-pages $(git_url) docsite; fi

build:
	if test -d docsite ; then cd docsite && git rm -r .; fi
	if test -d docsite ; then cp -R src/* docsite; fi
	if test -d docsite ; then cp -R ../java/core/target/apidocs docsite/javadoc; fi
	if test -d docsite ; then cd docsite && git add . && git commit -m "Update documentation"; fi

deploy:
	test -d docsite && cd docsite && git push
