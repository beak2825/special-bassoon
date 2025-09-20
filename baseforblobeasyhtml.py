import os
import base64
import webbrowser

# Define file extensions that are allowed directly.
ALLOWED_EXTENSIONS = {
    '.js', '.html', '.css', '.ico', '.txt', 
    '.png', '.jpg', '.gif', '.svg', '.webmanifest', 
    '.md', '.py'  # Removed .xml and .wasm from allowed extensions.
}

# List of all script entries for converted files.
script_entries = []

def encode_file_to_base64(filepath):
    """
    Encodes a file's contents into a base64 data URL format.
    """
    with open(filepath, 'rb') as file:
        encoded_bytes = base64.b64encode(file.read())
        encoded_str = encoded_bytes.decode('utf-8')
        # Infer the mime type from the file extension.
        ext = os.path.splitext(filepath)[1]
        mime_type = "application/octet-stream"  # Default fallback MIME type.
        if ext in ['.txt', '.py']:
            mime_type = f"text/{ext[1:]}"
        elif ext == '.js':
            mime_type = "application/javascript"
        elif ext == '.html':
            mime_type = "text/html"
        elif ext == '.wasm':
            mime_type = "application/wasm"  # Set MIME type for .wasm files
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
        elif ext == '.ogg':
            mime_type = "audio/ogg"
        
        return f"data:{mime_type};base64,{encoded_str}"

def generate_js_wrapper(filepath, base64_data):
    """
    Generates a JavaScript file that will create a Blob from the encoded data.
    """
    js_filename = f"{os.path.basename(filepath)}.js"
    js_content = f"""
window['{os.path.basename(filepath)}'] = function(t) {{
    try {{
        var e = atob(t.split(",")[1]);
        var a = t.split(",")[0].split(":")[0];
        var r = new ArrayBuffer(e.length);
        var o = new Uint8Array(r);
        for (var i = 0; i < e.length; i++)
            o[i] = e.charCodeAt(i);
        a = new Blob([r], {{
            type: a
        }});
        return URL.createObjectURL(a);
    }} catch (t) {{
        alert("Failed to convert data URL to Blob URL");
        console.error("Failed to convert data URL to Blob URL:", t);
    }}
}}("{base64_data}");
"""

    # Write the JavaScript wrapper to a file.
    with open(js_filename, 'w') as js_file:
        js_file.write(js_content)
    
    # Add to the list of script tags.
    script_entries.append(f'<script src="{js_filename}"></script>')

def process_directory(root_dir):
    """
    Processes a directory, converting unsupported files into Base64 JS wrappers.
    """
    # Iterate over files and directories in the specified root directory.
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # If there are more than 15 subfolders, skip processing this directory.
        if len(dirnames) > 15:
            print(f"Skipping '{dirpath}' because it has more than 15 subfolders.")
            continue

        # Iterate over each file in the directory.
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            ext = os.path.splitext(filename)[1]

            # If the file's extension is not allowed, convert it.
            if ext.lower() not in ALLOWED_EXTENSIONS:
                base64_data = encode_file_to_base64(filepath)
                generate_js_wrapper(filepath, base64_data)
            else:
                print(f"Skipping allowed file type: {filename}")

def save_script_entries():
    """
    Saves the script entries to a text file and opens it.
    """
    output_filename = "converted_files.txt"
    with open(output_filename, 'w') as output_file:
        output_file.write("\n".join(script_entries))
    print(f"Script tags saved in {output_filename}")
    
    # Automatically open the .txt file.
    webbrowser.open(output_filename)

def main():
    current_dir = os.path.dirname(os.path.realpath(__file__))
    print(f"Processing files in '{current_dir}'...")
    process_directory(current_dir)
    save_script_entries()
    print("Conversion complete.")

if __name__ == "__main__":
    main()
