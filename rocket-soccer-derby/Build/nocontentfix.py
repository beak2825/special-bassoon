import os
import re
import requests

def find_and_replace_files_with_content():
    """
    Search the script's directory for files under 200 bytes containing a "No Content: {URL}" message.
    If found, download the content from the specified URL and replace the file content.
    """
    
    # Set directory to the script's current location
    directory = os.path.dirname(os.path.abspath(__file__))
    # Regex to match the URL in "No Content: {URL}" pattern
    no_content_pattern = re.compile(r"No Content:\s*(https?://[^\s]+)")

    # Traverse the directory tree
    for root, _, files in os.walk(directory):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            try:
                # Check file size
                if os.path.getsize(file_path) < 200:
                    with open(file_path, 'r') as file:
                        content = file.read()
                    
                    # Search for the pattern and extract the URL if found
                    match = no_content_pattern.search(content)
                    if match:
                        url = match.group(1)
                        # Download content from URL
                        response = requests.get(url)
                        response.raise_for_status()  # Ensure we successfully retrieved the content
                        
                        # Replace file content with downloaded content
                        with open(file_path, 'wb') as file:
                            file.write(response.content)
                        print(f"Replaced content in file: {file_path}")

            except Exception as e:
                print(f"Error processing file {file_path}: {e}")

# Run the function
find_and_replace_files_with_content()
