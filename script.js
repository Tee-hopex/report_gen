document.getElementById('reportForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData();
    const data = document.getElementById('data').value;
    const image = document.getElementById('image').files[0];

    formData.append('data', data);
    if (image) {
        formData.append('image', image);
    }

    const response = await fetch('http://localhost:7000/dohs/generate-report', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    const messageDiv = document.getElementById('message');
    if (response.ok) {
        messageDiv.innerHTML = `<p class="success">PDF generated successfully. <a class="link" href="${result.path}" target="_blank">Download PDF</a></p>`;
    } else {
        messageDiv.innerHTML = `<p class="error">Error: ${result.msg}</p>`;
    }
});
