function convertToSeconds(time) {
    const parts = time.split(':');
    let minutes = 0, seconds = 0, hundredths = 0;

    if (parts.length === 1) {
        // Case: SS or SS.hh
        const secondsParts = parts[0].split('.');
        seconds = parseInt(secondsParts[0], 10);
        hundredths = secondsParts.length === 2 ? parseInt(secondsParts[1].padEnd(2, '0'), 10) : 0;
    } else if (parts.length === 2) {
        // Case: MM:SS or MM:SS.hh
        minutes = parseInt(parts[0], 10);
        const secondsParts = parts[1].split('.');
        seconds = parseInt(secondsParts[0], 10);
        hundredths = secondsParts.length === 2 ? parseInt(secondsParts[1].padEnd(2, '0'), 10) : 0;
    } else {
        return null;
    }

    const totalSeconds = (minutes * 60) + seconds + (hundredths / 100);
    return totalSeconds;
}

function convertToFormattedTime(seconds) {
    if (isNaN(seconds)) return 'N/A';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(2);

    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return `${minutes}:${formattedSeconds}`;
}

function handleConversion(timeInSeconds, courseType, stroke, distance) {
    const gender = courseType.split('-')[0]; // Extract 'M' or 'W'
    const course = courseType.split('-')[1]; // Extract 'SCY', 'LCM', or 'SCM'
    
    const eventKey = `${distance}${stroke}`;

    let convertedTime = {};

    if (course === 'SCY') {
        convertedTime.LCM = timeInSeconds / (conversionTable[gender].SCY_to_LCM[eventKey] || 1);
        convertedTime.SCM = timeInSeconds / (conversionTable[gender].SCY_to_SCM[eventKey] || 1);
    } else if (course === 'LCM') {
        const scyTime = timeInSeconds * (conversionTable[gender].SCY_to_LCM[eventKey] || 1);
        convertedTime.SCY = scyTime;
        convertedTime.SCM = scyTime / (conversionTable[gender].SCY_to_SCM[eventKey] || 1);
    } else if (course === 'SCM') {
        const scyTime = timeInSeconds * (conversionTable[gender].SCY_to_SCM[eventKey] || 1);
        convertedTime.SCY = scyTime;
        convertedTime.LCM = scyTime / (conversionTable[gender].SCY_to_LCM[eventKey] || 1);
    }

    const formattedTimeSCY = course !== 'SCY' ? `SCY: ${convertToFormattedTime(convertedTime.SCY)}` : '';
    const formattedTimeLCM = course !== 'LCM' ? `LCM: ${convertToFormattedTime(convertedTime.LCM)}` : '';
    const formattedTimeSCM = course !== 'SCM' ? `SCM: ${convertToFormattedTime(convertedTime.SCM)}` : '';

    return `
        ${formattedTimeSCY ? `<p>${formattedTimeSCY}</p>` : ''}
        ${formattedTimeLCM ? `<p>${formattedTimeLCM}</p>` : ''}
        ${formattedTimeSCM ? `<p>${formattedTimeSCM}</p>` : ''}
    `;
}
