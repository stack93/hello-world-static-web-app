// scripts/main.js
const strokeOptions = {
    '50': ['Free', 'Back', 'Breast', 'Fly'],
    '100': ['Free', 'Back', 'Breast', 'Fly', 'IM'],
    '200': ['Free', 'Back', 'Breast', 'Fly', 'IM'],
    '400': ['Free', 'IM'],
    '500': ['Free'],
    '800': ['Free'],
    '1000': ['Free'],
    '1500': ['Free'],
    '1650': ['Free']
};

document.getElementById('distance').addEventListener('change', function() {
    const distance = this.value;
    const strokeSelect = document.getElementById('stroke');
    
    // Clear existing options
    strokeSelect.innerHTML = '';
    
    // Populate new options based on the selected distance
    strokeOptions[distance].forEach(stroke => {
        const option = document.createElement('option');
        option.value = stroke;
        option.textContent = stroke;
        strokeSelect.appendChild(option);
    });
});

// Trigger change event to populate initial stroke options
document.getElementById('distance').dispatchEvent(new Event('change'));

document.getElementById('conversionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const timeInput = document.getElementById('timeInput').value;
    const courseType = document.getElementById('courseType').value;
    const distance = document.getElementById('distance').value;
    const stroke = document.getElementById('stroke').value;

    const timeInSeconds = convertToSeconds(timeInput);
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

function convertToSeconds(time) {
    const timeParts = time.split(':');
    if (timeParts.length === 1) {
        // Case: ss.ss
        return parseFloat(timeParts[0]);
    } else if (timeParts.length === 2) {
        // Case: mm:ss.ss
        const minutes = parseFloat(timeParts[0]);
        const seconds = parseFloat(timeParts[1]);
        return (minutes * 60) + seconds;
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