document.addEventListener('DOMContentLoaded', function() {
    const minutesInput = document.getElementById('minutesInput');
    const secondsInput = document.getElementById('secondsInput');
    const hundredthsInput = document.getElementById('hundredthsInput');
    const resetButton = document.getElementById('resetButton');
    const courseTypeSelect = document.getElementById('courseType');
    const strokeSelect = document.getElementById('stroke');
    const distanceSelect = document.getElementById('distance');
    const submitButton = document.querySelector('button[type="submit"]');
    const resultDiv = document.getElementById('result');

    const distanceOptions = {
        'SCY': {
            'Free': ['50', '100', '200', '400_500', '800_1000', '1500_1600'],
            'Back': ['50', '100', '200'],
            'Breast': ['50', '100', '200'],
            'Fly': ['50', '100', '200'],
            'IM': ['200', '400'],
            'FreestyleRelay': ['200', '400', '800'],
            'MedleyRelay': ['200', '400']
        },
        'LCM': {
            'Free': ['50', '100', '200', '400', '800', '1500'],
            'Back': ['50', '100', '200'],
            'Breast': ['50', '100', '200'],
            'Fly': ['50', '100', '200'],
            'IM': ['200', '400'],
            'FreestyleRelay': ['200', '400', '800'],
            'MedleyRelay': ['200', '400']
        },
        'SCM': {
            'Free': ['50', '100', '200', '400', '800', '1500'],
            'Back': ['50', '100', '200'],
            'Breast': ['50', '100', '200'],
            'Fly': ['50', '100', '200'],
            'IM': ['200', '400'],
            'FreestyleRelay': ['200', '400', '800'],
            'MedleyRelay': ['200', '400']
        }
    };

    courseTypeSelect.addEventListener('change', function() {
        strokeSelect.disabled = false;
        distanceSelect.disabled = true;

        strokeSelect.value = '';
        distanceSelect.innerHTML = '<option value="" disabled selected>Select Distance</option>';
        submitButton.disabled = true;
    });

    strokeSelect.addEventListener('change', function() {
        distanceSelect.disabled = false;

        distanceSelect.innerHTML = '<option value="" disabled selected>Select Distance</option>';
        
        distanceOptions[courseTypeSelect.value][strokeSelect.value].forEach(distance => {
            const option = document.createElement('option');
            option.value = distance;
            option.textContent = distance;
            distanceSelect.appendChild(option);
        });

        submitButton.disabled = true;
    });

    distanceSelect.addEventListener('change', function() {
        submitButton.disabled = false;
    });

    document.getElementById('conversionForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const minutes = parseInt(minutesInput.value, 10) || 0;
        const seconds = parseInt(secondsInput.value, 10) || 0;
        let hundredths = parseInt(hundredthsInput.value, 10) || 0;

        if (hundredths < 10 && hundredthsInput.value.length === 1) {
            hundredths *= 10; // Treat single digit as tenths
        }

        const timeInSeconds = minutes * 60 + seconds + hundredths / 100;

        const courseType = courseTypeSelect.value;
        const stroke = strokeSelect.value;
        const distance = distanceSelect.value;

        const resultHtml = handleConversion(timeInSeconds, courseType, stroke, distance);
        resultDiv.innerHTML = resultHtml;
    });

    const timeInputs = [secondsInput, hundredthsInput];
    timeInputs.forEach(input => {
        input.addEventListener('input', function() {
            const isValid = secondsInput.value.trim() !== '' && hundredthsInput.value.trim() !== '';
            submitButton.disabled = !isValid || !courseTypeSelect.value || !strokeSelect.value || !distanceSelect.value;
        });
    });

    resetButton.addEventListener('click', function() {
        minutesInput.value = '';
        secondsInput.value = '';
        hundredthsInput.value = '';
        resultDiv.innerHTML = '';
        submitButton.disabled = true;
    });
});
