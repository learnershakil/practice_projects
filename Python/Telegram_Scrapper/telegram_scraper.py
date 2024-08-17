import csv
import tkinter as tk
from tkinter import filedialog
from telethon.sync import TelegramClient
from telethon.tl import types
from telethon.tl.types import PeerChannel
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import spacy
from wordcloud import WordCloud
import matplotlib.pyplot as plt

# Download required NLTK resources
nltk.download('vader_lexicon')

# Load spaCy model
nlp = spacy.load('en_core_web_sm')

api_id = 'YOUR_API_ID'
api_hash = 'YOUR_API_HASH'
phone_number = 'YOUR_PHONE_NUMBER'

# Create a TelegramClient object
client = TelegramClient('session_name', api_id, api_hash)

# GUI window
window = tk.Tk()
window.title('Telegram Scraper')
window.geometry('400x500')


def start_scraping():
    channels = channels_entry.get().split(',')  # Retrieve the channels from the input field
    keywords = keywords_entry.get().split(',')  # Retrieve the keywords from the input field
    username = username_entry.get()  # Retrieve the username from the input field
    min_messages = int(min_messages_entry.get())  # Retrieve the minimum messages count from the input field

    # Define the filter criteria
    filter_criteria = {
        'contains': keywords,
        'sender_username': username,
        'min_messages': min_messages
    }

    # Start the scraping process
    scrape_channels(channels, filter_criteria)


def scrape_channels(channels, filter_criteria):
    # Connect to Telegram
    client.start(phone_number)

    scraped_messages = []
    user_data = {}
    word_freq = {}

    for channel in channels:
        # Retrieve the entity of the channel
        entity = client.get_entity(channel)

        # Fetch messages from the channel
        messages = client.get_messages(entity, limit=None)

        if len(messages) < filter_criteria['min_messages']:
            continue

        for message in messages:
            # Check if the message meets the filter criteria
            if filter_criteria_met(message, filter_criteria):
                media_data = extract_media(message)
                sentiment = perform_sentiment_analysis(message.message)
                entities = extract_entities(message.message)
                user_info = retrieve_user_info(message.sender_id)

                scraped_messages.append({
                    'channel': channel,
                    'sender_username': get_username(message.sender_id),
                    'message': message.message,
                    'date': message.date,
                    'media': media_data,
                    'sentiment': sentiment,
                    'entities': entities
                })

                # Store user information if not already stored
                if user_info and user_info.user_id not in user_data:
                    user_data[user_info.user_id] = {
                        'username': user_info.username,
                        'bio': user_info.bio,
                        'followers': user_info.followers_count,
                        'join_date': user_info.date.strftime('%Y-%m-%d')
                    }

                # Update word frequency
                update_word_frequency(message.message, word_freq)

    # Store the scraped messages and user data in separate CSV files
    save_to_csv(scraped_messages, 'messages.csv')
    save_to_csv(list(user_data.values()), 'users.csv')

    # Generate and save word cloud
    generate_word_cloud(word_freq, 'wordcloud.png')


def get_username(user_id):
    # Retrieve the username of the user with the given user ID
    user = client.get_entity(user_id)
    return user.username


def filter_criteria_met(message, criteria):
    # Check if the message meets the filter criteria
    if criteria.get('contains') and not any(keyword.lower() in message.message.lower() for keyword in criteria['contains']):
        return False

    if criteria.get('sender_username') and criteria['sender_username'].lower() != get_username(message.sender_id).lower():
        return False

    return True


def extract_media(message):
    # Extract and download media attachments from the message
    media_data = []
    for media in message.media:
        if isinstance(media, (types.MessageMediaPhoto, types.MessageMediaDocument)):
            file_path = client.download_media(media)
            media_data.append({
                'type': media.__class__.__name__,
                'file_path': file_path
            })
    return media_data


def perform_sentiment_analysis(text):
    # Perform sentiment analysis on the text
    sid = SentimentIntensityAnalyzer()
    sentiment_scores = sid.polarity_scores(text)
    sentiment = {
        'positive': sentiment_scores['pos'],
        'negative': sentiment_scores['neg'],
        'neutral': sentiment_scores['neu']
    }
    return sentiment


def extract_entities(text):
    # Extract named entities from the text
    doc = nlp(text)
    entities = [ent.text for ent in doc.ents]
    return entities


def retrieve_user_info(user_id):
    # Retrieve additional user information
    try:
        user_info = client.get_entity(user_id)
        return user_info
    except:
        return None


def save_to_csv(data, filename):
    # Prompt user to select a file to save the scraped data
    file_path = filedialog.asksaveasfilename(defaultextension='.csv')

    if file_path:
        # Save the scraped data to a CSV file
        with open(file_path, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['Channel', 'Sender Username', 'Message', 'Date', 'Media', 'Sentiment', 'Entities']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            writer.writeheader()
            for item in data:
                writer.writerow({
                    'Channel': item['channel'],
                    'Sender Username': item['sender_username'],
                    'Message': item['message'],
                    'Date': item['date'],
                    'Media': item['media'],
                    'Sentiment': item['sentiment'],
                    'Entities': item['entities']
                })

        # Show a success message
        result_label.config(text='Scraping completed and saved to CSV.')


def update_word_frequency(text, word_freq):
    # Update word frequency dictionary
    words = text.lower().split()
    for word in words:
        if word.isalpha():
            word_freq[word] = word_freq.get(word, 0) + 1


def generate_word_cloud(word_freq, filename):
    # Generate and save word cloud image
    wordcloud = WordCloud(width=800, height=400, background_color='white').generate_from_frequencies(word_freq)
    plt.figure(figsize=(10, 5))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis('off')
    plt.savefig(filename)


# GUI elements
channels_label = tk.Label(window, text='Channels (separated by comma):')
channels_label.pack()
channels_entry = tk.Entry(window)
channels_entry.pack()

keywords_label = tk.Label(window, text='Keywords (separated by comma):')
keywords_label.pack()
keywords_entry = tk.Entry(window)
keywords_entry.pack()

username_label = tk.Label(window, text='Sender Username:')
username_label.pack()
username_entry = tk.Entry(window)
username_entry.pack()

min_messages_label = tk.Label(window, text='Minimum Messages Count:')
min_messages_label.pack()
min_messages_entry = tk.Entry(window)
min_messages_entry.pack()

start_button = tk.Button(window, text='Start Scraping', command=start_scraping)
start_button.pack()

result_label = tk.Label(window, text='')
result_label.pack()

window.mainloop()
