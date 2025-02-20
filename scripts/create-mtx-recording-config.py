import yaml

# Output YAML file
OUTPUT_FILE = "mediamtx.yml"

# Base RTSP URL
RTSP_BASE = "rtsp://admin:admin@192.168.101.80"

# Start and end ports
START_PORT = 20001
END_PORT = 20200

# Recording paths and storage capacities (Modify accordingly)
# STORAGE_PATHS = {
#     "/media/matrix/mtx-1tb-1/recordings": 1000,  # Capacity in GB
#     "/media/matrix/mtx-8tb-1/recordings": 8000,  # Capacity in GB
# }

STORAGE_PATHS = {
    "/media/sharanphadke/c5c688cd-1fc3-4574-a97d-9d62dc366ae02/recordings": 1000,  # Capacity in GB
}


# Calculate total capacity
total_capacity = sum(STORAGE_PATHS.values())

# Calculate streams per storage location
STREAM_DISTRIBUTION = {
    path: (capacity * (END_PORT - START_PORT + 1)) // total_capacity
    for path, capacity in STORAGE_PATHS.items()
}

# Construct MediaMTX configuration
yaml_config = {"paths": {}}

# Assign streams dynamically
port = START_PORT
for path, count in STREAM_DISTRIBUTION.items():
    for _ in range(count):
        if port > END_PORT:
            break
        
        stream_name = f"stream_{port}"
        rtsp_url = f"{RTSP_BASE}:{port}/video/h264/h264-704x576-30FPS-50GOP-512Kbps-aac-16Khz-32Kbps.mp4"
        recording_path = f"{path}/{stream_name}/%Y-%m-%d_%H-%M-%S-%f"
        
        yaml_config["paths"][stream_name] = {
            "source": rtsp_url,
            "sourceOnDemand": False,
            "record": True,
            "recordPath": recording_path
        }
        
        port += 1

# Write configuration to YAML file
with open(OUTPUT_FILE, "w") as file:
    yaml.dump(yaml_config, file, default_flow_style=False)

print(f"MediaMTX configuration saved to {OUTPUT_FILE}")
