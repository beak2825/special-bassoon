import os
import base64

def list_files():
    files = [f for f in os.listdir() if os.path.isfile(f)]
    print("Select a file to convert:")
    for idx, file in enumerate(files, 1):
        print(f"{idx}. {file}")
    return files

def select_file(files):
    while True:
        try:
            choice = int(input("\nEnter the number corresponding to the file: "))
            if 1 <= choice <= len(files):
                return files[choice - 1]
            else:
                print(f"Please enter a number between 1 and {len(files)}.")
        except ValueError:
            print("Invalid input. Please enter a number.")

def encode_file_to_base64(filename):
    with open(filename, 'rb') as file:
        encoded_bytes = base64.b64encode(file.read())
        encoded_str = encoded_bytes.decode('utf-8')
    return f"data:application/wasm;base64,{encoded_str}"

def generate_js_wrapper(filename, base64_data):
    js_filename = f"{filename}.js"
    js_content = f"""
window['{filename}'] = function(t) {{
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

    with open(js_filename, 'w') as js_file:
        js_file.write(js_content)
    print(f"JavaScript wrapper saved as {js_filename}")

def main():
    files = list_files()
    selected_file = select_file(files)
    base64_data = encode_file_to_base64(selected_file)
    generate_js_wrapper(selected_file, base64_data)

if __name__ == "__main__":
    main()
