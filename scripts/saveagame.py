import os

def generate_game_entry():
    # Ask for game name and path
    game_input = input("Put your game into the order like this (path:name:thumbnail): ")
    
    # Split the input string into path, name, and thumbnail parts
    game_data = game_input.split(":")
    
    if len(game_data) != 3:
        print("Invalid input format. Please ensure you use path:name:thumbnail format.")
        return

    path, name, thumbnail = game_data

    # Format the game entry for the games array
    game_entry = f'"{path}:{name}:{thumbnail}",'

    # Open the gamesData.js file and read existing data
    with open('gamesData.js', 'r') as f:
        lines = f.readlines()

    # Find where the games array starts and ends
    for idx, line in enumerate(lines):
        if line.strip() == "const games = [":  # This identifies where the games array begins
            start_idx = idx
            break
    
    # Find the closing bracket of the array (the line that closes the array)
    for idx in range(start_idx + 1, len(lines)):
        if lines[idx].strip() == "];":  # This identifies where the games array ends
            end_idx = idx
            break
    
    # Extract the array content
    games_data = lines[start_idx + 1:end_idx]

    # Now insert the new game entry at the top inside the array
    games_data.insert(0, f"  {game_entry}\n")

    # Rewrite the entire file with the updated content
    with open('gamesData.js', 'w') as f:
        f.writelines(lines[:start_idx + 1])  # Keep the part before the games array
        f.writelines(games_data)             # Insert the updated games array data
        f.writelines(lines[end_idx:])        # Keep the part after the array (the closing bracket)

    print(f"Game entry added successfully: {game_entry}")


if __name__ == "__main__":
    generate_game_entry()
