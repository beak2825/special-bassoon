import os
import base64
import sys

# File extensions to skip
SKIP_EXTENSIONS = {".py", ".html", ".js", ".json", ".css"}

def base64_encode_file(input_path: str) -> str:
    """
    Encodes a single file into Base64 and writes it to <filename>.b64.

    Args:
        input_path (str): Path to the file.

    Returns:
        str: Path to the encoded output file.
    """
    # Skip if extension is excluded
    _, ext = os.path.splitext(input_path)
    if ext.lower() in SKIP_EXTENSIONS:
        return ""

    # Read file data
    with open(input_path, "rb") as f:
        file_data = f.read()

    # Encode file data to Base64
    encoded_data = base64.b64encode(file_data)

    # Write encoded data to a .b64 file
    output_path = f"{input_path}.b64"
    with open(output_path, "wb") as f:
        f.write(encoded_data)

    return output_path

def encode_all_files(target_dir: str) -> None:
    """
    Encodes all files in the given directory except those with skipped extensions.

    Args:
        target_dir (str): Directory to process.
    """
    processed_files = []
    skipped_files = []

    # Walk through all files in the directory (non-recursive)
    for filename in os.listdir(target_dir):
        file_path = os.path.join(target_dir, filename)

        # Skip directories
        if os.path.isdir(file_path):
            continue

        # Check if extension is excluded
        _, ext = os.path.splitext(filename)
        if ext.lower() in SKIP_EXTENSIONS:
            skipped_files.append(filename)
            continue

        # Encode the file
        try:
            output_file = base64_encode_file(file_path)
            if output_file:
                processed_files.append(filename)
        except Exception as e:
            print(f"[!] Failed to encode {filename}: {e}")

    # Print summary
    print("\n=== Base64 Encoding Completed ===")
    print(f"Encoded Files ({len(processed_files)}):")
    for f in processed_files:
        print(f"  - {f} -> {f}.b64")

    print(f"\nSkipped Files ({len(skipped_files)}):")
    for f in skipped_files:
        print(f"  - {f}")

if __name__ == "__main__":
    # Get target directory from CLI args, default = current directory
    target_directory = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    encode_all_files(target_directory)
