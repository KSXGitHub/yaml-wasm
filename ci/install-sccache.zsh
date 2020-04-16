#!/bin/zsh

if [[ -z $SCCACHE_VERSION ]]; then
  echo '$SCCACHE_VERSION is not defined' > /dev/stderr
  exit 1
fi

mkdir /sccache || exit $?

prefix=https://github.com/mozilla/sccache/releases/download
url=$prefix/$SCCACHE_VERSION/sccache-$SCCACHE_VERSION-x86_64-unknown-linux-musl.tar.gz
binary=/sccache/sccache-$SCCACHE_VERSION-x86_64-unknown-linux-musl/sccache

echo Downloading and extracting $url
curl -fL# $url | tar -xvzf - -C /sccache || exit $?

echo Installing sccache
chmod a+x $binary
exec ln -s $binary /bin/sccache
