import os

# Define the expected directory structure and files
expected_structure = {
    "assets": ["circle.png", "ellipse.png", "rectangle.png", "square.png", "triangle.png"],
    "public": ["favicon.ico", "index.html"],
    "src": [
        "App.css",
        "App.test.js",
        "config.json",
        "index.js",
        {
            "components": ["App.js", "Canvas.js", "ErrorModal.js", "Settings.js"]
        }
    ]
}

def rename_file_if_needed(path, expected_name):
    dir_name = os.path.dirname(path)
    for file_name in os.listdir(dir_name):
        if file_name.lower() == expected_name.lower() and file_name != expected_name:
            os.rename(os.path.join(dir_name, file_name), path)
            print(f"Renamed {file_name} to {expected_name}")

def check_and_rename_structure(base_path, structure):
    for key, value in structure.items():
        path = os.path.join(base_path, key)
        if isinstance(value, list):
            for item in value:
                if isinstance(item, str):
                    # Check if files exist and rename if needed
                    file_path = os.path.join(path, item)
                    if not os.path.exists(file_path):
                        rename_file_if_needed(file_path, item)
                        if not os.path.exists(file_path):
                            print(f"Missing file: {file_path}")
                elif isinstance(item, dict):
                    # Check nested directories recursively
                    check_and_rename_structure(path, item)
        elif isinstance(value, dict):
            # Check directories recursively
            if not os.path.exists(path):
                print(f"Missing directory: {path}")
            check_and_rename_structure(path, value)

# Run the check and rename
base_path = os.getcwd()
check_and_rename_structure(base_path, expected_structure)
