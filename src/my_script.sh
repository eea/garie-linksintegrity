#!/usr/bin/env bash
set -e

echo "Start getting data"

echo "Getting data for: $1"

echo "Recursion depth: $3"

report_location=$2/$(date +"%FT%H%M%S+0000")

mkdir -p $report_location

timeout 1800 linkchecker $1 $3 --no-robots > $report_location/linksintegrity.txt 2>&1

echo "Finished getting data for: $1"

exit 0

