document.getElementById('contact-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    const contactData = { name, email, phone, message };
    console.log(contactData);

    try {
        const response = await fetch('http://localhost:3003/data.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData),
        });

        if (response.ok) {
            alert('Your message has been submitted successfully!');
            document.getElementById('contact-form').reset();
        } else {
            const errorData = await response.json();
            alert(`Failed to submit your message: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting your message.');
    }
});
