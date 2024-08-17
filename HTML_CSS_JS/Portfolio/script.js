document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    for (let anchor of anchorLinks) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 50,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Form submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Perform validation and send form data to the server
        if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
            alert('Please fill in all fields.');
        } else {
            // Send form data to the server using AJAX or fetch API
            // Example using fetch API:
            fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            })
                .then(response => response.json())
                .then(data => {
                    alert('Form submitted successfully!');
                    // Reset form fields
                    contactForm.reset();
                })
                .catch(error => {
                    alert('An error occurred. Please try again later.');
                });
        }
    });
});
