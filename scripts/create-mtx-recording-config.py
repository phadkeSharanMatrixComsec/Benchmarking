import yaml

def generate_yml(n, base_url, base_recording_path):
    # Create the structure of the YAML file
    data = {'paths': {}}
    # Iterate for n streams
    for i in range(n):
        stream_name = f'mystream{i}'
        stream_data = {
            'source': f'{base_url}{i}',  # Increment stream URL by appending the index
            'sourceOnDemand': False,
            'record': True,
            'recordPath': f'{base_recording_path}/recordings/%path/%Y-%m-%d_%H-%M-%S-%f',  # Assign recording path dynamically
            'recordPartDuration': '1s',
            'recordSegmentDuration': '60s',
            'recordDeleteAfter': '1000s'
        }
        data['paths'][stream_name] = stream_data
    
    # Save the YAML content to a file
    with open('streams.yml', 'w') as file:
        yaml.dump(data, file, default_flow_style=False)

if __name__ == "__main__":
    # Configuration
    n = 1000  # Number of iterations (streams)
    base_url = "rtsp://192.168.27.79:8554/mystream"  # Base RTSP URL
    # base_recording_path = "/media/matrixuser/64A034ECA034C5F8"  # Base directory for recordings
    # base_recording_path = "/run/user/1000/gvfs/ftp:host=192.168.27.167" # FTP Path
    base_recording_path = "/mnt/nas" # NAS Path

    generate_yml(n, base_url, base_recording_path)
    print("YAML file 'streams.yml' has been generated.")
