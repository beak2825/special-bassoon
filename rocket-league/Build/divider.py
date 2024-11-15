import os

def list_files_in_directory():
    """Lists files in the current directory and returns the list of file names."""
    files = [f for f in os.listdir('.') if os.path.isfile(f)]
    for idx, file in enumerate(files, 1):
        print(f"{idx}. {file}")
    return files

def get_file_choice(files):
    """Prompts the user to pick a file from a list of files."""
    while True:
        try:
            choice = int(input("Enter the number of the file you want to split: ")) - 1
            if 0 <= choice < len(files):
                return files[choice]
            else:
                print("Invalid choice. Please select a valid file number.")
        except ValueError:
            print("Please enter a valid integer.")

def split_file(file_path, num_parts):
    """
    Splits the specified file into `num_parts` equal-sized pieces.
    
    Parameters:
    - file_path (str): Path of the file to split.
    - num_parts (int): Number of parts to split the file into.
    """
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    file_size = os.path.getsize(file_path)
    chunk_size = file_size // num_parts
    extra_bytes = file_size % num_parts
    
    # Separate original file name and extension
    file_name, file_extension = os.path.splitext(file_path)

    with open(file_path, 'rb') as file:
        for i in range(num_parts):
            # Create new file name for each part
            part_file_name = f"{file_name}_{i + 1}{file_extension}"
            with open(part_file_name, 'wb') as part_file:
                # Calculate size for each part, last part includes extra bytes
                bytes_to_write = chunk_size + (extra_bytes if i == num_parts - 1 else 0)
                part_file.write(file.read(bytes_to_write))
                print(f"Created {part_file_name} ({bytes_to_write} bytes)")

if __name__ == "__main__":
    # Step 1: List and choose a file
    print("Files in the current directory:")
    files = list_files_in_directory()
    selected_file = get_file_choice(files)

    # Step 2: Get number of parts to divide the file into
    while True:
        try:
            num_parts = int(input("Enter the number of parts to divide the file into: "))
            if num_parts > 0:
                break
            else:
                print("Number of parts must be a positive integer.")
        except ValueError:
            print("Please enter a valid integer.")

    # Step 3: Split the file
    split_file(selected_file, num_parts)
    print("File split completed.")
