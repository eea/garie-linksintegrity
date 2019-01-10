#!/bin/sh
set -e


if [ -n "$CONFIG" ]; then
	echo "Found configuration variable, will write it to the /usr/src/garie-ssslabs/config.json"
	echo "$CONFIG" > /usr/src/garie-linksintegrity/config.json
fi

exec "$@"
