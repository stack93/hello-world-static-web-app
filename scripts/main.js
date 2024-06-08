// scripts/main.js

$(function() {
    // Initialize the spinner for the time input
    $("#timeInput").spinner({
        min: 0,
        step: 0.01,
        numberFormat: "n"
    });

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

    $('#courseType').on('change', function() {
        const courseType = this.value;
        const strokeSelect = $('#stroke');
        const distanceSelect = $('#distance');
        const submitButton = $('button[type="submit"]');
        
        strokeSelect.prop('disabled', false);
        distanceSelect.prop('disabled', true);

        distanceSelect.html('<option value="" disabled selected>Select Distance</option>');
        submitButton.prop('disabled', true);
    });

    $('#stroke').on('change', function() {
        const stroke = this.value;
        const courseType = $('#courseType').val();
        const distanceSelect = $('#distance');
        const submitButton = $('button[type="submit"]');
        
        distanceSelect.prop('disabled', false);

        distanceSelect.html('<option value="" disabled selected>Select Distance</option>');
        
        distanceOptions[courseType][stroke].forEach(distance => {
            distanceSelect.append(new Option(distance, distance));
        });

        submitButton.prop('disabled', true);
    });

    $('#distance').on('change', function() {
        $('button[type="submit"]').prop('disabled', false);
    });

    $('#conversionForm').on('submit', function(event) {
        event.preventDefault();

        const timeInput = $('#timeInput').val();
        const courseType = $('#courseType').val();
        const stroke = $('#stroke').val();
        const distance = $('#distance').val();

        const timeInSeconds = convertToSeconds(timeInput);
        if (timeInSeconds === null) {
            $('#result').text('Invalid time format. Please enter a valid time.');
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

        const resultHTML = `
            ${formattedTimeSCY ? `<p>${formattedTimeSCY}</p>` : ''}
            ${formattedTimeLCM ? `<p>${formattedTimeLCM}</p>` : ''}
            ${formattedTimeSCM ? `<p>${formattedTimeSCM}</p>` : ''}
        `;

        $('#result').html(resultHTML);
    });

    function convertToSeconds(time) {
        const parts = time.split(':');
        if (parts.length === 1) {
            // Case: SS.hh
            const secondsParts = parts[0].split('.');
            if (secondsParts.length !== 2) return null;
            const seconds = parseInt(secondsParts[0], 10);
            const hundredths = parseInt(secondsParts[1], 10);
            return seconds + (hundredths / 100);
        } else if (parts.length === 2) {
            // Case: MM:SS.hh
            const minutes = parseInt(parts[0], 10);
            const secondsParts = parts[1].split('.');
            if (secondsParts.length !== 2) return null;
            const seconds = parseInt(secondsParts[0], 10);
            const hundredths = parseInt(secondsParts[1], 10);
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
