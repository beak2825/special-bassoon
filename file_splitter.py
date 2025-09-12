import os
import math

def list_files():
    files = [f for f in os.listdir('.') if os.path.isfile(f)]
    for idx, f in enumerate(files, start=1):
        print(f"{idx}: {f}")
    return files

def split_file_large(file_path, parts):
    if parts < 1:
        raise ValueError("Number of parts must be >= 1")

    total_size = os.path.getsize(file_path)
    part_size = total_size // parts
    remainder = total_size % parts

    base_name = os.path.basename(file_path)
    name_root, ext = os.path.splitext(base_name)

    with open(file_path, "rb") as f:
        for i in range(1, parts + 1):
            # Each part gets an extra byte if remainder remains
            current_part_size = part_size + (1 if i <= remainder else 0)
            part_file_name = f"{name_root}_{i}{ext}"

            with open(part_file_name, "wb") as pf:
                bytes_written = 0
                while bytes_written < current_part_size:
                    chunk_size = min(1024 * 1024, current_part_size - bytes_written)  # 1MB chunks
                    chunk = f.read(chunk_size)
                    if not chunk:
                        break
                    pf.write(chunk)
                    bytes_written += len(chunk)

            print(f"Written {part_file_name} ({current_part_size} bytes)")

if __name__ == "__main__":
    files = list_files()
    if not files:
        print("No files found in current directory.")
        exit()

    selection = int(input("Select a file by number: "))
    if selection < 1 or selection > len(files):
        print("Invalid selection.")
        exit()
    file_path = files[selection - 1]

    parts = int(input("Enter number of parts to split into: "))
    split_file_large(file_path, parts)
