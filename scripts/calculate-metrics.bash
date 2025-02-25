#!/bin/bash

# Get interval and period from CLI arguments or set defaults
INTERVAL=${1:-1}
PERIOD=${2:-10}

# Run commands in the background and capture their outputs
tmpfile_cpu=$(mktemp)
tmpfile_mem=$(mktemp)
tmpfile_pidstat=$(mktemp)

sar -u $INTERVAL $PERIOD > "$tmpfile_cpu" &
sar -r $INTERVAL $PERIOD > "$tmpfile_mem" &
pidstat -d $INTERVAL $PERIOD > "$tmpfile_pidstat" &

# Wait for all background jobs to complete
wait

# Print the first and last lines of each output
echo "CPU Usage:"
head -n 3 "$tmpfile_cpu"
tail -n 1 "$tmpfile_cpu"

echo "============================================================================================================================="

echo "Memory Usage:"
head -n 3 "$tmpfile_mem"
tail -n 1 "$tmpfile_mem"

echo "============================================================================================================================="


echo "PID Stats:"
head -n 1 "$tmpfile_pidstat"
grep -E "^#|Average:" "$tmpfile_pidstat"

# Cleanup temporary files
rm -f "$tmpfile_cpu" "$tmpfile_mem" "$tmpfile_pidstat"
