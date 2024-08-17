document.addEventListener('DOMContentLoaded', () => {
    const newDogBtn = document.getElementById('new-dog-btn');
    const dogImageContainer = document.getElementById('dog-image-container');

    // Function to fetch a random dog image
    async function fetchDogImage() {
        try {
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json();
            displayDogImage(data.message);
        } catch (error) {
            dogImageContainer.innerHTML = '<p>Failed to fetch dog image. Please try again later.</p>';
        }
    }

    // Function to display the dog image
    function displayDogImage(imageUrl) {
        dogImageContainer.innerHTML = `<img src="${imageUrl}" alt="Random Dog Image">`;
    }

    // Event listener for the button
    newDogBtn.addEventListener('click', fetchDogImage);

    // Fetch initial dog image on page load
    fetchDogImage();
});
