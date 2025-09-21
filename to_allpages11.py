import os

def update_html_files(root_dir: str, old_str: str, new_str: str) -> None:
    """
    Recursively walks through folders starting at root_dir,
    finds all .html files, and replaces old_str with new_str.

    :param root_dir: The starting directory path.
    :param old_str: String to be replaced.
    :param new_str: Replacement string.
    """
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".html"):
                file_path = os.path.join(dirpath, filename)

                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()

                    if old_str in content:
                        updated_content = content.replace(old_str, new_str)

                        with open(file_path, "w", encoding="utf-8") as f:
                            f.write(updated_content)

                        print(f"[UPDATED] {file_path}")
                    else:
                        print(f"[NO CHANGE] {file_path}")

                except Exception as e:
                    print(f"[ERROR] Could not process {file_path}: {e}")


if __name__ == "__main__":
    # Change this to the path where your HTML files are located
    root_directory = "."

    update_html_files(root_directory, "allpages8", "allpages11")
