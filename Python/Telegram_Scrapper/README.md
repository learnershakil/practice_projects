# Telegram Scraper

Telegram Scraper is a powerful Python script that allows you to scrape and analyze messages from Telegram channels. It provides advanced features like filtering, sentiment analysis, entity extraction, and word frequency analysis to gain valuable insights from Telegram conversations. Whether you're conducting research, monitoring discussions, or extracting information, Telegram Scraper is your go-to solution.

## Features

- **Message Scraping**: Easily scrape messages from Telegram channels.
- **Advanced Filtering**: Apply filter criteria based on keywords, sender username, and minimum message count.
- **Sentiment Analysis**: Analyze message sentiment polarity using a pre-trained sentiment intensity analyzer.
- **Entity Extraction**: Extract named entities from messages for deeper analysis and categorization.
- **User Information**: Retrieve user information of message senders for user profiling.
- **Word Frequency Analysis**: Generate visually appealing word clouds based on word frequency in messages.
- **Data Export**: Save scraped messages and user data in CSV files for further analysis.

## Installation

1. Clone the repository:

   ```shell
   git clone https://github.com/learnershakil/Python_Projects/Telegram_Scrapper.git
   ```

2. Navigate to the project directory:

   ```shell
   cd Telegram_Scrapper
   ```

3. Install the required dependencies:

   ```shell
   pip install -r requirements.txt
   ```

4. Obtain Telegram API credentials:
   - Create a new application on the Telegram API platform.
   - Obtain the API ID and API Hash.

5. Update the `api_id`, `api_hash`, and `phone_number` variables in the script with your own credentials.

## Usage

1. Run the script:

   ```shell
   python telegram_scraper.py
   ```

2. The graphical interface will be displayed.
3. Enter the channels, keywords, sender username, and minimum message count for scraping.
4. Click the "Start Scraping" button to initiate the scraping process.
5. The scraped messages will be saved in a `messages.csv` file, and user data will be saved in a `users.csv` file.
6. A visually appealing word cloud image will be generated based on the word frequency in the messages.

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## Acknowledgements

Telegram Scraper was built with the help of the following libraries:

- [Telethon](https://github.com/LonamiWebs/Telethon)
- [NLTK](https://github.com/nltk/nltk)
- [spaCy](https://github.com/explosion/spaCy)
- [WordCloud](https://github.com/amueller/word_cloud)
- [Matplotlib](https://github.com/matplotlib/matplotlib)

Special thanks to the contributors who made these libraries possible. Their hard work and dedication are greatly appreciated.
