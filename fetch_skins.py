import requests
import json
import os

# URL API
url = "https://bymykel.github.io/CSGO-API/api/en/skins.json"
images_dir = "images"

# Upewnij się, że katalog images istnieje
if not os.path.exists(images_dir):
    os.makedirs(images_dir)

# Pobranie danych z API
response = requests.get(url)
skins_data = response.json()

# Przetworzenie danych i zapisanie do skins.json
processed_skins = []

for skin in skins_data:
    image_url = skin["image"]
    image_name = os.path.basename(image_url)
    image_path = os.path.join(images_dir, image_name)

    # Pobranie i zapisanie obrazu
    image_response = requests.get(image_url)
    if image_response.status_code == 200:
        with open(image_path, 'wb') as img_file:
            img_file.write(image_response.content)

    processed_skin = {
        "id": skin["id"],
        "name": skin["name"],
        "description": skin["description"],
        "weapon": skin["weapon"]["name"],
        "category": skin["category"]["name"],
        "pattern": skin["pattern"]["name"] if skin["pattern"] else "Unknown",
        "rarity": skin["rarity"]["name"],
        "rarity_color": skin["rarity"]["color"],
        "image": image_path.replace("\\", "/"),  # Aktualizacja ścieżki do obrazu
        "value": 10  # Możesz dostosować wartość według własnych kryteriów
    }
    processed_skins.append(processed_skin)

# Zapisanie do pliku JSON
with open('data/skins.json', 'w', encoding='utf-8') as f:
    json.dump(processed_skins, f, ensure_ascii=False, indent=4)

print("Skins data has been fetched, images downloaded, and data saved to data/skins.json")
