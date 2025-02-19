#!/bin/bash

# Check if the required arguments are provided
if [ "$#" -lt 3 ]; then
    echo "Usage: $0 <file-path> <rtsp-port> <number-of-iterations>"
    exit 1
fi

FILE_PATH=$1
START_PORT=$2
NUM_ITERATIONS=$3
PIDS=()

# Function to clean up streams
cleanup() {
    echo "Stopping streams..."
    for PID in "${PIDS[@]}"; do
        kill "$PID" 2>/dev/null
    done
    echo "All streams stopped."
    exit 0
}

# Trap CTRL+C (SIGINT) signal
trap cleanup SIGINT

# Start streams
for (( i=0; i<NUM_ITERATIONS; i++ )); do
    # PORT=$((START_PORT + i))
    ffmpeg -re -stream_loop -1 -i "$FILE_PATH" -c copy -rtsp_transport tcp -f rtsp rtsp://192.168.27.79:$START_PORT/mystream$i > /dev/null 2>&1 &

    PIDS+=($!)
    echo "Started mystream$i on port $START_PORT (PID=${PIDS[-1]})"
done

# Wait indefinitely for CTRL+C
echo "Streams running. Press CTRL+C to stop."
while true; do
    sleep 1
done