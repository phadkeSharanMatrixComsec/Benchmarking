import yaml

def generate_yaml(file_name, n, base_url):
    data = {"paths": {}}
    
    for i in range(n):
        stream_name = f"mystream{i}"
        source_url = f"{base_url}/{stream_name}"
        data["paths"][stream_name] = {
            "source": source_url
        }
    
    with open(file_name, "w") as file:
        yaml.dump(data, file, default_flow_style=False)
    
    print(f"YAML file '{file_name}' generated successfully!")

# Example usage
generate_yaml("mediamtx_live_stream_100.yml", 100, "rtsp://192.168.27.79:8554")
