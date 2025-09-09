import os
import base64
import sys

def decode_base64_file(input_path: str) -> str:
    """
    Decodes a file containing pure Base64 data and saves the decoded result.

    Args:
        input_path (str): Path to the Base64-encoded file.

    Returns:
        str: Path to the decoded output file.
    """
    # Ensure file exists
    if not os.path.isfile(input_path):
        raise FileNotFoundError(f"Input file not found: {input_path}")

    # Read the Base64 content
    with open(input_path, "rb") as f:
        base64_data = f.read()

    try:
        # Decode the Base64 data
        decoded_data = base64.b64decode(base64_data)
    except Exception as e:
        raise ValueError(f"Failed to decode Base64 data: {e}")

    # Get filename and extension
    dirname, filename = os.path.split(input_path)
    name, ext = os.path.splitext(filename)

    # Create output filename
    output_filename = f"{name}_decode{ext}"
    output_path = os.path.join(dirname, output_filename)

    # Write the decoded data to the output file
    with open(output_path, "wb") as f:
        f.write(decoded_data)

    return output_path


if __name__ == "__main__":
    # Ensure an argument is provided
    if len(sys.argv) != 2:
        print("Usage: python decode_base64.py <base64_file>")
        sys.exit(1)

    input_file = sys.argv[1]

    try:
        output_file = decode_base64_file(input_file)
        print(f"[+] Successfully decoded file:\n{output_file}")
    except Exception as e:
        print(f"[!] Error: {e}")
        sys.exit(1)