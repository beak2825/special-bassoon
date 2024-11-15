import os
import json

# Function to list images in the ../images directory
def list_images(directory):
    images = [f for f in os.listdir(directory) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif'))]
    images.sort()  # Sort images alphabetically
    return images

# Function to get the image choice from the user
def get_image_choice(images):
    print("\nSelect the game image by number:")
    for i, img in enumerate(images, 1):
        print(f"{i}. {img}")
    choice = int(input("Enter the number of your choice: ")) - 1
    if 0 <= choice < len(images):
        return images[choice]
    else:
        print("Invalid choice, please try again.")
        return get_image_choice(images)

# Function to get the game details
def get_game_details():
    game_name = input("What's the game name?: ")
    print("\nPlease select an image for the game.")
    
    # Get the absolute path for the images directory (one level up)
    current_directory = os.getcwd()
    project_directory = os.path.dirname(current_directory)  # Go up one directory to the project folder
    images_dir = os.path.join(project_directory, 'images')  # Access the 'images' directory
    
    # Ensure the images directory exists
    if not os.path.exists(images_dir):
        print("The 'images' directory does not exist. Please make sure it's located in the root of the project.")
        return None
    
    # Get a list of images from the ../images directory
    images = list_images(images_dir)
    
    # Get image choice from the user
    selected_image = get_image_choice(images)
    
    # Construct the URL for the selected image
    image_url = f"https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/images/{selected_image}"

    # Get the game link
    game_link = input(f"What's the link for {game_name}?: ")

    # Construct the new game data
    new_game = {
        "link": game_link,
        "name": game_name,
        "thumbnail": image_url,
        "gif": None,
        "fixing": None
    }

    return new_game

# Function to add the new game to the JSON file
def add_game_to_json(new_game):
    # Check if the JSON file exists
    json_file = 'games.json'
    if os.path.exists(json_file):
        with open(json_file, 'r') as f:
            games = json.load(f)
    else:
        games = []
    
    # Add the new game to the list
    games.append(new_game)

    # Write the updated list back to the JSON file
    with open(json_file, 'w') as f:
        json.dump(games, f, indent=4)

# Main execution
if __name__ == "__main__":
    print("Welcome to the Game Addition Script!")
    new_game = get_game_details()
    
    if new_game:  # Only add the game if the details were successfully retrieved
        add_game_to_json(new_game)
        print(f"Game '{new_game['name']}' has been added successfully!")
