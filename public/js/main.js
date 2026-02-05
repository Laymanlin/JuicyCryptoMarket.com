// Main JavaScript for index.html
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

// Fetch and display market data
async function fetchMarketData() {
    try {
        const response = await fetch(`${API_BASE_URL}/market/prices`);
        const data = await response.json();
        
        if (data.success) {
            displayMarketData(data.data);
        }
    } catch (error) {
        console.error('Error fetching market data:', error);
        document.getElementById('market-data').innerHTML = '<p class="error-message" style="display:block;">Failed to load market data</p>';
    }
}

function displayMarketData(cryptos) {
    const container = document.getElementById('market-data');
    
    if (!cryptos || cryptos.length === 0) {
        container.innerHTML = '<p>No market data available</p>';
        return;
    }
    
    container.innerHTML = cryptos.map(crypto => {
        const changeClass = crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative';
        const changeSymbol = crypto.price_change_percentage_24h >= 0 ? '+' : '';
        
        return `
            <div class="market-card">
                <div class="crypto-info">
                    <h3>${crypto.name}</h3>
                    <span class="symbol">${crypto.symbol.toUpperCase()}</span>
                </div>
                <div class="crypto-price">
                    <div class="price">$${crypto.current_price.toLocaleString()}</div>
                    <div class="change ${changeClass}">
                        ${changeSymbol}${crypto.price_change_percentage_24h.toFixed(2)}%
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    fetchMarketData();
    // Refresh market data every 30 seconds
    setInterval(fetchMarketData, 30000);
});
