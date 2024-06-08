// scripts/main.js

document.addEventListener('DOMContentLoaded', function() {
    const timeInput = document.getElementById('timeInput');
    const courseTypeSelect = document.getElementById('courseType');
    const strokeSelect = document.getElementById('stroke');
    const distanceSelect = document.getElementById('distance');
    const submitButton = document.querySelector('button[type="submit"]');
    const resultDiv = document.getElementById('result');

    const distanceOptions = {
        'SCY': {
            'Free': ['50', '100', '200', '500', '1000', '1650'],
            'Back': ['50', '100', '200'],
            'Breast': ['50', '100', '200'],
            'Fly': ['50', '100', '200'],
            'IM': ['100', '200', '400']
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
            'IM': ['100', '200', '400']
        }
    };

    courseTypeSelect.addEventListener('change', function() {
        const courseType = courseTypeSelect.value;
        strokeSelect.disabled = false;
        distanceSelect.disabled = true;

        strokeSelect.value = '';
        distanceSelect.innerHTML = '<option value="" disabled selected>Select Distance</option>';
        submitButton.disabled = true;
    });

    strokeSelect.addEventListener('change', function() {
        const stroke = strokeSelect.value;
        const courseType = courseTypeSelect.value;
        distanceSelect.disabled = false;

        distanceSelect.innerHTML = '<option value="" disabled selected>Select Distance</option>';
        
        distanceOptions[courseType][stroke].forEach(distance => {
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

        const timeInSeconds = convertToSeconds(timeInputValue);
        if (timeInSeconds === null) {
            resultDiv.innerText = 'Invalid time format. Please enter a valid time.';
            return;
        }

        const eventKey = distance + stroke;

        let convertedTime = {};

        if (courseType === 'SCY') {
            convertedTime.LCM = timeInSeconds * (conversionTable.SCY_to_LCM[eventKey] || 1);
            convertedTime.SCM = timeInSeconds * (conversionTable.SCY_to_SCM[eventKey] || 1);
        } else if (courseType === 'LCM') {
            convertedTime.SCY = timeInSeconds * (conversionTable.LCM_to_SCY[eventKey] || 1);
            convertedTime.SCM = timeInSeconds * (conversionTable.LCM_to_SCM[eventKey] || 1);
        } else if (courseType === 'SCM') {
            convertedTime.SCY = timeInSeconds * (conversionTable.SCM_to_SCY[eventKey] || 1);
            convertedTime.LCM = timeInSeconds * (conversionTable.SCM_to_LCM[eventKey] || 1);
        }

        const formattedTimeSCY = courseType !== 'SCY' ? `SCY: ${convertToFormattedTime(convertedTime.SCY)}` : '';
        const formattedTimeLCM = courseType !== 'LCM' ? `LCM: ${convertToFormattedTime(convertedTime.LCM)}` : '';
        const formattedTimeSCM = courseType !== 'SCM' ? `SCM: ${convertToFormattedTime(convertedTime.SCM)}` : '';

        resultDiv.innerHTML = `
            ${formattedTimeSCY ? `<p>${formattedTimeSCY}</p>` : ''}
            ${formattedTimeLCM ? `<p>${formattedTimeLCM}</p>` : ''}
            ${formattedTimeSCM ? `<p>${formattedTimeSCM}</p>` : ''}
        `;
    });

    function convertToSeconds(time) {
        const parts = time.split(':');
        if (parts.length === 1) {
            // Case: SS or SS.hh
            const secondsParts = parts[0].split('.');
            const seconds = parseInt(secondsParts[0], 10);
            const hundredths = secondsParts.length === 2 ? parseInt(secondsParts[1], 10) : 0;
            return seconds + (hundredths / 100);
        } else if (parts.length === 2) {
            // Case: MM:SS or MM:SS.hh
            const minutes = parseInt(parts[0], 10);
            const secondsParts = parts[1].split('.');
            const seconds = parseInt(secondsParts[0], 10);
            const hundredths = secondsParts.length === 2 ? parseInt(secondsParts[1], 10) : 0;
            return (minutes * 60) + seconds + (hundredths / 100);
        } else {
            return null;
        }
    }

    function convertToFormattedTime(seconds) {
        if (isNaN(seconds)) return 'N/A';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = (seconds % 60).toFixed(2);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
});
