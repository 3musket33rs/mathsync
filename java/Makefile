build:
	mvn clean install

set-dev-version:
	mvn org.codehaus.mojo:versions-maven-plugin:2.1:set -DnewVersion=$(VERSION)-SNAPSHOT -DgenerateBackupPoms=false

set-release-version:
	mvn org.codehaus.mojo:versions-maven-plugin:2.1:set -DnewVersion=$(VERSION) -DgenerateBackupPoms=false
