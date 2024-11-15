import os
import base64

def list_files():
    # List all files in the current directory
    files = [f for f in os.listdir('.') if os.path.isfile(f) and f.endswith('.swf')]
    return files

def select_file(files):
    print("Select a file to convert to Base64:")
    for index, file in enumerate(files, start=1):
        print(f"{index}. {file}")
    
    while True:
        try:
            choice = int(input("Enter the number of the file to convert: "))
            if 1 <= choice <= len(files):
                return files[choice - 1]
            else:
                print("Invalid choice. Please try again.")
        except ValueError:
            print("Please enter a valid number.")

def convert_to_base64(filename):
    with open(filename, 'rb') as file:
        encoded_string = base64.b64encode(file.read()).decode('utf-8')
    return f'window.data="data:application/vnd.adobe.flash.movie;base64,{encoded_string}"'

def save_to_js(data, name):
    js_filename = f"{name}.js"
    with open(js_filename, 'w') as js_file:
        js_file.write(data)
    print(f"Data saved to {js_filename}")

def main():
    files = list_files()
    if not files:
        print("No .swf files found in the current directory.")
        return

    selected_file = select_file(files)
    js_data = convert_to_base64(selected_file)
    file_name = os.path.splitext(selected_file)[0]  # Get the name without extension
    save_to_js(js_data, file_name)

if __name__ == "__main__":
    main()
