document.getElementById('myForm').addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    nameError.style.display = 'none';
    emailError.style.display = 'none';
    passwordError.style.display = 'none';

    // Validate name
    if (name === '') {
        nameError.textContent = 'Name is required';
        nameError.style.display = 'block';
        valid = false;
    }

    // Validate email
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) {
        emailError.textContent = 'Invalid email address';
        emailError.style.display = 'block';
        valid = false;
    }

    // Validate password
    if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters long';
        passwordError.style.display = 'block';
        valid = false;
    }

    if (valid) {
        alert('Form submitted successfully!');
    }
});
