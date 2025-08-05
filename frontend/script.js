const identifyBtn = document.getElementById('identifyBtn');
const imageInput = document.getElementById('imageInput');
const resultDiv = document.getElementById('result');
const loader = document.getElementById('loader');
const previewImage = document.getElementById('previewImage');
const uploadText = document.getElementById('uploadText');
const uploadIcon = document.querySelector('.icon');

// Show image preview
imageInput.addEventListener('change', () => {
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewImage.style.display = "block";
            uploadText.style.opacity = "0";
            uploadIcon.style.opacity = "0";
        };
        reader.readAsDataURL(imageInput.files[0]);
    }
});

// Identify plant
identifyBtn.addEventListener('click', async () => {
    if (imageInput.files.length === 0) {
        alert("Please select an image first.");
        return;
    }

    const file = imageInput.files[0];
    const base64Image = await toBase64(file);

    resultDiv.innerHTML = "";
    loader.style.display = "block";

    const backendURL = "https://spring-bloom.onrender.com"; 

    try {
        const response = await fetch(backendURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ base64Image })
        });

        const data = await response.json();
        loader.style.display = "none";

        if (data.suggestions && data.suggestions.length > 0) {
            const plant = data.suggestions[0];
            const confidence = plant.probability;

            if (confidence < 0.6) {
                resultDiv.innerHTML = "Low confidence. Try another image.";
            } else {
                resultDiv.innerHTML = `
                    <h3>${plant.plant_name}</h3>
                    <p>Common Names: ${plant.plant_details.common_names.join(", ")}</p>
                    <a href="${plant.plant_details.url}" target="_blank">More Info</a>
                `;
            }
        } else {
            resultDiv.innerHTML = "Could not identify. Try another image.";
        }
    } catch (err) {
        console.error(err);
        loader.style.display = "none";
        resultDiv.innerHTML = "Server error. Try again.";
    }
});

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}
