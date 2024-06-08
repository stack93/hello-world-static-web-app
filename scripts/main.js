// scripts/main.js

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

document.getElementById('courseType').addEventListener('change', function() {
    const courseType = this.value;
    const strokeSelect = document.getElementById('stroke');
    const distanceSelect = document.getElementById('distance');
    const submitButton = document.querySelector('button[type="submit"]');
    
    // Enable the stroke dropdown
    strokeSelect.disabled = false;
    distanceSelect.disabled = true;

    // Clear and disable distance options until a stroke is selected
    distanceSelect.innerHTML = '<option value="" disabled selected>Select Distance</option>';
    distanceSelect.disabled = true;
    
    // Clear and disable the submit button
    submitButton.disabled = true;
});

document.getElementById('stroke').addEventListener('change', function() {
    const stroke = this.value;
    const courseType = document.getElementById('courseType').value;
    const distanceSelect = document.getElementById('distance');
    const submitButton = document.querySelector('button[type="submit"]');
    
    // Enable the distance dropdown
    distanceSelect.disabled = false;

    // Clear existing distance options
    distanceSelect.innerHTML = '<option value="" disabled selected>Select Distance</option>';
    
    // Populate new distance options based on the selected course type and stroke
    distanceOptions[courseType][stroke].forEach(distance => {
        const option = document.createElement('option');
        option.value = distance;
        option.textContent = distance;
        distanceSelect.appendChild(option);
    });

    // Clear and disable the submit button until a distance is selected
    submitButton.disabled = true;
});

document.getElementById('distance').addEventListener('change', function() {
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = false;
});

document.getElementById('conversionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const timeMinutes = document.getElementById('timeMinutes').value;
    const timeSeconds = document.getElementById('timeSeconds').value;
    const timeHundredths = document.getElementById('timeHundredths').value;
    const courseType = document.getElementById('courseType').value;
    const stroke = document.getElementById('stroke').value;
    const distance = document.getElementById('distance').value;

    const timeInSeconds = convertToSeconds(timeMinutes, timeSeconds, timeHundredths);
    if (timeInSeconds === null) {
        document.getElementById('result').innerText = 'Invalid time format. Please enter a valid time.';
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

    const formattedTimeSCY = courseType !== 'SCY' ? `SCY: ${convertToFormattedTime(convertedTime.SCY)}\n` : '';
    const formattedTimeLCM = courseType !== 'LCM' ? `LCM: ${convertToFormattedTime(convertedTime.LCM)}\n` : '';
    const formattedTimeSCM = courseType !== 'SCM' ? `SCM: ${convertToFormattedTime(convertedTime.SCM)}\n` : '';

    document.getElementById('result').innerText = `Converted Time:\n${formattedTimeSCY}${formattedTimeLCM}${formattedTimeSCM}`;
});

function convertToSeconds(minutes, seconds, hundredths) {
    return parseFloat(minutes) * 60 + parseFloat(seconds) + parseFloat(hundredths) / 100;
}

function convertToFormattedTime(seconds) {
    if (isNaN(seconds)) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(2);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
