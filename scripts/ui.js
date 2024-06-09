document.addEventListener('DOMContentLoaded', function() {
    const timeInput = document.getElementById('timeInput');
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
            'IM': ['200', '400']
        },
        'LCM': {
            'Free': ['50', '100', '200', '400', '800', '1500'],
            'Back': ['50', '100', '200'],
            'Breast': ['50', '100', '200'],
            'Fly': ['50', '100', '200'],
            'IM': ['200', '400']
        },
        'SCM': {
            'Free': ['50', '100', '200', '400', '800', '1500'],
            'Back': ['50', '100', '200'],
            'Breast': ['50', '100', '200'],
            'Fly': ['50', '100', '200'],
            'IM': ['200', '400']
        }
    };

    const scmToLcmAddition = {
        'Free': { '50': 0.8, '100': 1.6, '200': 3.2, '400': 6.4, '800': 12.8, '1500': 24 },
        'Back': { '50': 0.6, '100': 1.2, '200': 2.4 },
        'Breast': { '50': 1.0, '100': 2.0, '200': 4.0 },
        'Fly': { '50': 0.7, '100': 1.4, '200': 2.8 },
        'IM': { '200': 3.2, '400': 6.4 }
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

        const timeInputValue = timeInput.value;
        const courseType = courseTypeSelect.value;
        const stroke = strokeSelect.value;
        const distance = distanceSelect.value;

        const resultHtml = handleConversion(timeInputValue, courseType, stroke, distance);
        resultDiv.innerHTML = resultHtml;
    });

    timeInput.addEventListener('input', function() {
        const timeValue = timeInput.value.trim();
        const isValid = /^(\d+:\d{1,2}(\.\d{1,2})?|^\d+(\.\d{1,2})?)$/.test(timeValue);
        timeInput.setCustomValidity(isValid ? '' : 'Invalid time format');
        submitButton.disabled = !isValid || !courseTypeSelect.value || !strokeSelect.value || !distanceSelect.value;
    });
});
