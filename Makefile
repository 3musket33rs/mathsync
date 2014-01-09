init:
	make init -C javascript
	make init -C features/support

build:
	make build -C java
	make build -C javascript

test: build
	echo "Not yet implemented - bundle exec cucumber"

deploy:
	make deploy -C java
	make deploy -C javascript
	cd docsite && git push

build-doc:
	test -d docsite || git clone -b gh-pages $(git config --get remote.origin.url) docsite
	cd docsite && git rm -r .
	cp -R doc/* docsite
	cp -R java/core/target/apidocs docsite/javadoc
	cd docsite && git add .
	cd docsite && git commit -m "Update documentation"

push-doc:
	cd docsite && git push

set-dev-version:
	make set-dev-version -C java
	make set-dev-version -C javascript

set-release-version:
	make set-release-version -C java
	make set-release-version -C javascript
