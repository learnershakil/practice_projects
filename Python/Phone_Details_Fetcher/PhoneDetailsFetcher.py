import phonenumbers
import requests
from bs4 import BeautifulSoup
from tkinter import *

def validate_phone_number(phone_number):
    try:
        parsed_number = phonenumbers.parse(phone_number, None)
        if not phonenumbers.is_valid_number(parsed_number):
            return False
    except phonenumbers.phonenumberutil.NumberParseException:
        return False
    return True

def fetch_carrier_details(phone_number):
    url = f"https://api.example.com/carrier/{phone_number}"
    response = requests.get(url)
    carrier_details = response.json()
    return carrier_details

def fetch_location_details(phone_number):
    url = f"https://www.example.com/location/{phone_number}"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    location_details = soup.find("div", class_="location-info").text
    return location_details

def fetch_social_media_profiles(phone_number):
    # Replace with actual implementation to fetch social media profiles
    # using appropriate APIs or techniques based on the phone number
    # Return a list of social media profiles
    social_media_profiles = [
        {"name": "John Doe", "platform": "Twitter", "link": "https://twitter.com/johndoe"},
        {"name": "John Doe", "platform": "Facebook", "link": "https://facebook.com/johndoe"},
        {"name": "John Doe", "platform": "Instagram", "link": "https://instagram.com/johndoe"},
    ]
    return social_media_profiles

def fetch_details():
    phone_number = phone_number_input.get()

    if not validate_phone_number(phone_number):
        result_text.delete("1.0", END)
        result_text.insert(END, "Invalid phone number.")
        return

    carrier_details = fetch_carrier_details(phone_number)
    location_details = fetch_location_details(phone_number)
    social_media_profiles = fetch_social_media_profiles(phone_number)

    result_text.delete("1.0", END)
    result_text.insert(END, f"Phone number: {phone_number}\n\n")
    result_text.insert(END, f"Carrier: {carrier_details['carrier']}\n")
    result_text.insert(END, f"Line type: {carrier_details['line_type']}\n\n")
    result_text.insert(END, f"Location: {location_details}\n\n")
    result_text.insert(END, "Social media profiles:\n")
    for profile in social_media_profiles:
        result_text.insert(END, f"{profile['name']} - {profile['platform']}: {profile['link']}\n")

# GUI Setup
window = Tk()
window.title("Phone Number Details")
window.geometry("400x400")

phone_label = Label(window, text="Enter Phone Number:")
phone_label.pack()

phone_number_input = Entry(window)
phone_number_input.pack()

fetch_button = Button(window, text="Fetch Details", command=fetch_details)
fetch_button.pack()

result_text = Text(window, height=10, width=40)
result_text.pack()

window.mainloop()
