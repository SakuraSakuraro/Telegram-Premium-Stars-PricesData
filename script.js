document.addEventListener('DOMContentLoaded', function () {
    const typeSelect = document.getElementById('type');
    const countrySelect = document.getElementById('country');
    const priceForm = document.getElementById('priceForm');
    const priceTable = document.getElementById('priceTable');

    let countriesData = {};

    // Loading data from countries.json
    fetch('countries.json')
        .then(response => response.json())
        .then(data => {
            countriesData = data;
            populateCountrySelect(data);
            checkURLParams();
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));

    // Populate the country dropdown list
    function populateCountrySelect(data) {
        countrySelect.innerHTML = '';
        Object.keys(data).forEach(countryCode => {
            const option = document.createElement('option');
            option.value = countryCode;
            option.textContent = data[countryCode].name;
            countrySelect.appendChild(option);
        });
    }

    // Form submission handling
    priceForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const type = typeSelect.value;
        const country = countrySelect.value;
        updatePriceTable(type, country);
    });

    // Update the price table
    function updatePriceTable(type, country) {
        const countryData = countriesData[country];
        if (!countryData) {
            priceTable.innerHTML = '<p>No data available for the selected country.</p>';
            return;
        }

        let tableHTML = '';

        // If there is a message, display it instead of the table
        if (countryData.msg) {
            tableHTML = `<p class="message">${countryData.msg}</p>`;
        } else {
            // Otherwise, display the price table
            if (type === 'premium') {
                tableHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>Subscription period</th>
                                <th>Price (${countryData.currency})</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1 month</td>
                                <td>${countryData.premium.monthly}</td>
                            </tr>
                            <tr>
                                <td>1 year</td>
                                <td>${countryData.premium.yearly}</td>
                            </tr>
                        </tbody>
                    </table>
                `;
            } else if (type === 'stars') {
                tableHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>Quantity</th>
                                <th>Price (${countryData.currency})</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>100</td>
                                <td>${countryData.stars['100']}</td>
                            </tr>
                            <tr>
                                <td>150</td>
                                <td>${countryData.stars['150']}</td>
                            </tr>
                            <tr>
                                <td>250</td>
                                <td>${countryData.stars['250']}</td>
                            </tr>
                            <tr>
                                <td>350</td>
                                <td>${countryData.stars['350']}</td>
                            </tr>
                            <tr>
                                <td>500</td>
                                <td>${countryData.stars['500']}</td>
                            </tr>
                            <tr>
                                <td>750</td>
                                <td>${countryData.stars['750']}</td>
                            </tr>
                            <tr>
                                <td>1000</td>
                                <td>${countryData.stars['1000']}</td>
                            </tr>
                            <tr>
                                <td>1500</td>
                                <td>${countryData.stars['1500']}</td>
                            </tr>
                            <tr>
                                <td>2500</td>
                                <td>${countryData.stars['2500']}</td>
                            </tr>
                            <tr>
                                <td>5000</td>
                                <td>${countryData.stars['5000']}</td>
                            </tr>
                            <tr>
                                <td>10000</td>
                                <td>${countryData.stars['10000']}</td>
                            </tr>
                            <tr>
                                <td>25000</td>
                                <td>${countryData.stars['25000']}</td>
                            </tr>
                            <tr>
                                <td>50000</td>
                                <td>${countryData.stars['50000']}</td>
                            </tr>
                            <tr>
                                <td>100000</td>
                                <td>${countryData.stars['100000']}</td>
                            </tr>
                            <tr>
                                <td>150000</td>
                                <td>${countryData.stars['150000']}</td>
                            </tr>
                        </tbody>
                    </table>
                `;
            }
        }

        // Add the last updated date if available
        if (countryData.last_updated) {
            const lastUpdated = formatLastUpdated(countryData.last_updated);
            tableHTML += `<p class="last-updated">Last updated: ${lastUpdated}</p>`;
        } else if (!countryData.msg) {
            tableHTML += `<p class="last-updated">Last update date unavailable</p>`;
        }

        priceTable.innerHTML = tableHTML;
    }

    // Convert date to a readable format
    function formatLastUpdated(dateString) {
        if (!dateString || dateString.length !== 15) {
            console.error('Invalid date format:', dateString);
            return 'Invalid date';
        }

        const year = dateString.slice(0, 4);
        const month = dateString.slice(4, 6);
        const day = dateString.slice(6, 8);
        const hour = dateString.slice(9, 11);
        const minute = dateString.slice(11, 13);
        const second = dateString.slice(13, 15);

        return `${year}/${month}/${day} ${hour}:${minute}:${second} JST`;
    }

    // Check URL parameters
    function checkURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        const country = urlParams.get('country');
        const quantity = urlParams.get('quantity');
        const period = urlParams.get('for');

        if (type && country) {
            typeSelect.value = type;
            countrySelect.value = country;
            updatePriceTable(type, country);
        }
    }
});