const form = document.getElementById('registerForm');
const errorMessageElement = document.getElementById('errorMessage');

form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);
    const response = await fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": 'application/json'
        }
    })

    if (response.status === 201) {
        window.location.replace('/login');
    } else {
        try {
            const errorText = await response.text();
            const errorObject = JSON.parse(errorText);
            const errorMessage = errorObject.message || 'Error desconocido';
            errorMessageElement.innerText = `Error: ${errorMessage}`;
        } catch (error) {
            errorMessageElement.innerText = 'Error al procesar la respuesta del servidor';
        }
    }
})