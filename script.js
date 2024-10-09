document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bugForm');
    const formMessage = document.getElementById('form-message');
    const browserField = document.getElementById('browser');
    const osField = document.getElementById('os');

    // Function to detect browser and version
    function getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browserName = "Unknown";
        let fullVersion = "Unknown";

        // Detect browser name and version
        if (userAgent.indexOf("Firefox") > -1) {
            browserName = "Mozilla Firefox";
            fullVersion = userAgent.substring(userAgent.indexOf("Firefox") + 8);
        } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
            browserName = "Opera";
            fullVersion = userAgent.substring(userAgent.indexOf("Opera") + 6);
            if (userAgent.indexOf("OPR") > -1) {
                fullVersion = userAgent.substring(userAgent.indexOf("OPR") + 4);
            }
        } else if (userAgent.indexOf("Edge") > -1) {
            browserName = "Microsoft Edge";
            fullVersion = userAgent.substring(userAgent.indexOf("Edge") + 5);
        } else if (userAgent.indexOf("Chrome") > -1) {
            browserName = "Google Chrome";
            fullVersion = userAgent.substring(userAgent.indexOf("Chrome") + 7);
        } else if (userAgent.indexOf("Safari") > -1) {
            browserName = "Apple Safari";
            fullVersion = userAgent.substring(userAgent.indexOf("Safari") + 7);
            if (userAgent.indexOf("Version") > -1) {
                fullVersion = userAgent.substring(userAgent.indexOf("Version") + 8);
            }
        } else if (userAgent.indexOf("Trident") > -1) {
            browserName = "Microsoft Internet Explorer";
            fullVersion = userAgent.substring(userAgent.indexOf("rv:") + 3);
        }

        // Trim the fullVersion string at semicolon/space if present
        if ((ix = fullVersion.indexOf(";")) !== -1) fullVersion = fullVersion.substring(0, ix);
        if ((ix = fullVersion.indexOf(" ")) !== -1) fullVersion = fullVersion.substring(0, ix);

        return `${browserName} ${fullVersion}`;
    }

    // Function to detect operating system
    function getOSInfo() {
        const platform = navigator.platform.toLowerCase();
        const userAgent = navigator.userAgent.toLowerCase();
        let os = "Unknown";

        if (platform.indexOf('win') !== -1) {
            os = "Windows";
        } else if (platform.indexOf('mac') !== -1) {
            os = "macOS";
        } else if (platform.indexOf('linux') !== -1) {
            os = "Linux";
        } else if (/android/.test(userAgent)) {
            os = "Android";
        } else if (/iphone|ipad|ipod/.test(userAgent)) {
            os = "iOS";
        }

        // Further specify the version if possible
        // This is a basic detection and may need more detailed parsing for versions
        return os;
    }

    // Populate the browser and OS fields
    browserField.value = getBrowserInfo();
    osField.value = getOSInfo();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Replace 'YOUR_FORMSPREE_ENDPOINT' with your actual Formspree endpoint
        const formspreeEndpoint = 'https://formspree.io/f/your-form-id';

        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            const response = await fetch(formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                formMessage.style.color = 'green';
                formMessage.textContent = 'Thank you for your bug report!';
                form.reset();

                // Re-populate the browser and OS fields after reset
                browserField.value = getBrowserInfo();
                osField.value = getOSInfo();
            } else {
                const errorData = await response.json();
                formMessage.style.color = 'red';
                formMessage.textContent = errorData.errors
                    ? errorData.errors.map(error => error.message).join(', ')
                    : 'Something went wrong. Please try again.';
            }
        } catch (error) {
            formMessage.style.color = 'red';
            formMessage.textContent = 'An error occurred. Please try again.';
            console.error('Error submitting the form:', error);
        }
    });
});
