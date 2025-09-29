import os
import base64

# Define allowed file extensions
ALLOWED_EXTENSIONS = {
    '.js', '.html', '.css', '.ico', '.txt', 
    '.png', '.jpg', '.gif', '.svg', '.webmanifest', 
    '.md', '.py', '.mp3'
}

def encode_file_to_base64(filepath):
    """
    Encodes a file's contents into a Base64 data URL format.
    """
    with open(filepath, 'rb') as file:
        encoded_bytes = base64.b64encode(file.read())
        encoded_str = encoded_bytes.decode('utf-8')
        
        # Infer the MIME type from the file extension
        ext = os.path.splitext(filepath)[1].lower()
        mime_type = "application/octet-stream"  # Default MIME type
        if ext == '.swf':
            mime_type = "application/vnd.adobe.flash.movie"
        elif ext == '.png':
            mime_type = "image/png"
        elif ext in ['.jpg', '.jpeg']:
            mime_type = "image/jpeg"
        elif ext == '.gif':
            mime_type = "image/gif"
        elif ext == '.svg':
            mime_type = "image/svg+xml"
        elif ext == '.ico':
            mime_type = "image/x-icon"
        elif ext == '.html':
            mime_type = "text/html"
        elif ext == '.js':
            mime_type = "application/javascript"
        
        # Return the data URL format
        return f"data:{mime_type};base64,{encoded_str}"

def save_base64_to_file(base64_data, original_name):
    """
    Saves the Base64 data as a JavaScript file with a variable assignment.
    """
    js_filename = f"{original_name}.js"
    with open(js_filename, 'w') as js_file:
        variable_name = original_name.replace('.', '_')  # Create a valid variable name
        js_file.write(f"{base64_data}")
    
    print(f"Base64 data saved to {js_filename}")

def process_directory(root_dir):
    """
    Processes the current directory, encoding unsupported files to Base64.
    """
    files = [f for f in os.listdir(root_dir) if os.path.isfile(os.path.join(root_dir, f))]
    for filename in files:
        filepath = os.path.join(root_dir, filename)
        ext = os.path.splitext(filename)[1].lower()

        # If file extension is not allowed, encode it
        if ext not in ALLOWED_EXTENSIONS:
            base64_data = encode_file_to_base64(filepath)
            save_base64_to_file(base64_data, filename)  # Pass full filename without extension change
        else:
            print(f"Skipping allowed file type: {filename}")

def main():
    current_dir = os.path.dirname(os.path.realpath(__file__))
    print(f"Processing files in '{current_dir}'...")
    process_directory(current_dir)
    print("Conversion complete.")

if __name__ == "__main__":
    main()
