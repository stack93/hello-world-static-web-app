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
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function handleConversion(timeInputValue, courseType, stroke, distance) {
    const timeInSeconds = convertToSeconds(timeInputValue);
    if (timeInSeconds === null) {
        return 'Invalid time format. Please enter a valid time.';
    }

    const eventKey = `${distance}${stroke}`;

    let convertedTime = {};

    if (courseType === 'SCY') {
        convertedTime.LCM = timeInSeconds / (conversionTable.SCY_to_LCM[eventKey] || 1);
        convertedTime.SCM = timeInSeconds / (conversionTable.SCY_to_SCM[eventKey] || 1);
    } else if (courseType === 'LCM') {
        const scyTime = timeInSeconds * (conversionTable.SCY_to_LCM[eventKey] || 1);
        convertedTime.SCY = scyTime;
        convertedTime.SCM = scyTime / (conversionTable.SCY_to_SCM[eventKey] || 1);
    } else if (courseType === 'SCM') {
        const scyTime = timeInSeconds * (conversionTable.SCY_to_SCM[eventKey] || 1);
        convertedTime.SCY = scyTime;
        convertedTime.LCM = scyTime / (conversionTable.SCY_to_LCM[eventKey] || 1);
    }

    const formattedTimeSCY = courseType !== 'SCY' ? `SCY: ${convertToFormattedTime(convertedTime.SCY)}` : '';
    const formattedTimeLCM = courseType !== 'LCM' ? `LCM: ${convertToFormattedTime(convertedTime.LCM)}` : '';
    const formattedTimeSCM = courseType !== 'SCM' ? `SCM: ${convertToFormattedTime(convertedTime.SCM)}` : '';

    return `
        ${formattedTimeSCY ? `<p>${formattedTimeSCY}</p>` : ''}
        ${formattedTimeLCM ? `<p>${formattedTimeLCM}</p>` : ''}
        ${formattedTimeSCM ? `<p>${formattedTimeSCM}</p>` : ''}
    `;
}
