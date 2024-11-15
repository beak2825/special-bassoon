import os

def get_game_details():
    game_name = input("What's the game name?: ")
    
    # Get the list of images in the current directory
    images = [f for f in os.listdir('.') if os.path.isfile(f) and f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
    # List the images for selection
    print("Select the game image by number:")
    for i, img in enumerate(images, start=1):
        print(f"{i}. {img}")
    
    image_choice = int(input()) - 1
    thumbnail = images[image_choice]
    
    # Move the selected image to the "images" directory
    new_image_path = os.path.join('..', 'images', thumbnail)
    os.rename(thumbnail, new_image_path)
    
    # Generate the URL for the thumbnail
    thumbnail_url = f"https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/images/{thumbnail}"
    
    # Ask for the link
    print(f"What's the link for {game_name}?")
    print(f"https://sites.google.com/carthagecsd.org/sus/{game_name.replace(' ', '').lower()}: ")
    link = input("Enter the full link: ")
    
    # Format the game string and return it
    game_string = f'"{link}:{game_name}:{thumbnail_url}",'
    return game_string

# Add the new game to the gamesData.js file
def add_game_to_js(game_string):
    js_file_path = 'gamesData.js'
    
    # Open the file and read its content
    with open(js_file_path, 'r') as file:
        content = file.readlines()
    
    # Find the part to insert the new game at the top
    games_line = content[0].strip()  # This should be the line starting with 'const games = '
    
    # Insert the new game at the top of the array
    updated_games_line = games_line.replace('[', f'[{game_string}\n  ')
    
    # Write back the updated content
    with open(js_file_path, 'w') as file:
        content[0] = updated_games_line + '\n'  # Update the first line
        file.writelines(content)

if __name__ == "__main__":
    game_string = get_game_details()
    add_game_to_js(game_string)
    print(f"Game '{game_string.split(':')[1]}' has been added successfully!")
