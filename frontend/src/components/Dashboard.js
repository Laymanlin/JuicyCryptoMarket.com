import React, { useState, useEffect } from 'react';
import API_ENDPOINTS from '../config/api';

function Dashboard({ account, onLogout }) {
  const [marketPrices, setMarketPrices] = useState({});
  const [tradeType, setTradeType] = useState('buy');
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [currentAccount, setCurrentAccount] = useState(account);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMarketPrices();
    const interval = setInterval(fetchMarketPrices, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMarketPrices = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.marketPrices, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setMarketPrices(data.prices);
      }
    } catch (error) {
      console.error('Failed to fetch market prices:', error);
    }
  };

  const refreshAccount = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.account, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setCurrentAccount(data.account);
      }
    } catch (error) {
      console.error('Failed to refresh account:', error);
    }
  };

  const handleTrade = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const price = marketPrices[selectedCrypto];
      const response = await fetch(API_ENDPOINTS.trade, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: tradeType,
          cryptocurrency: selectedCrypto,
          amount: parseFloat(amount),
          price: price
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ ${tradeType.toUpperCase()} order executed successfully!`);
        setAmount('');
        await refreshAccount();
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Trade failed. Please try again.');
      console.error('Trade error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>🥤 JuicyCryptoMarket</h1>
          {currentAccount.isDemo && (
            <span className="demo-badge">🎮 Demo Mode</span>
          )}
        </div>
        <div className="header-right">
          <button className="btn-secondary" onClick={refreshAccount}>
            🔄 Refresh
          </button>
          <button className="btn-secondary btn-logout" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="wallet-section">
        <div className="wallet-label">Total Balance</div>
        <div className="wallet-balance">
          {formatCurrency(currentAccount.wallet.balance)}
        </div>
        {currentAccount.wallet.assets.length > 0 && (
          <div className="assets-list">
            <div className="wallet-label">Your Assets</div>
            {currentAccount.wallet.assets.map((asset, index) => (
              <div key={index} className="asset-item">
                <span>{asset.symbol}</span>
                <span>{asset.amount.toFixed(6)} coins</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="trading-section">
        <div className="market-prices">
          <h2 className="section-title">📊 Market Prices</h2>
          {Object.entries(marketPrices).map(([symbol, price]) => (
            <div key={symbol} className="price-item">
              <span className="crypto-symbol">{symbol}</span>
              <span className="crypto-price">{formatCurrency(price)}</span>
            </div>
          ))}
        </div>

        <div className="trade-form-section">
          <h2 className="section-title">💱 Trade</h2>
          {message && (
            <div style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '15px',
              background: message.includes('✅') ? '#d4edda' : '#f8d7da',
              color: message.includes('✅') ? '#155724' : '#721c24'
            }}>
              {message}
            </div>
          )}
          <form className="trade-form" onSubmit={handleTrade}>
            <div className="trade-type-selector">
              <button
                type="button"
                className={`trade-type-btn ${tradeType === 'buy' ? 'active' : ''}`}
                onClick={() => setTradeType('buy')}
              >
                📈 Buy
              </button>
              <button
                type="button"
                className={`trade-type-btn ${tradeType === 'sell' ? 'active' : ''}`}
                onClick={() => setTradeType('sell')}
              >
                📉 Sell
              </button>
            </div>

            <div className="form-group">
              <label>Cryptocurrency</label>
              <select
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
                disabled={loading}
              >
                {Object.keys(marketPrices).map(symbol => (
                  <option key={symbol} value={symbol}>
                    {symbol} - {formatCurrency(marketPrices[symbol])}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                step="0.000001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                disabled={loading}
                required
              />
            </div>

            {amount && marketPrices[selectedCrypto] && (
              <div style={{ 
                padding: '12px', 
                background: '#f0f0f0', 
                borderRadius: '8px',
                fontSize: '14px'
              }}>
                <strong>Total Cost:</strong> {formatCurrency(amount * marketPrices[selectedCrypto])}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !amount}
            >
              {loading ? 'Processing...' : `${tradeType.toUpperCase()} ${selectedCrypto}`}
            </button>
          </form>
        </div>
      </div>

      <div className="trades-history">
        <h2 className="section-title">📜 Trade History</h2>
        <div className="trades-list">
          {currentAccount.trades && currentAccount.trades.length > 0 ? (
            currentAccount.trades.slice().reverse().map((trade) => (
              <div key={trade.id} className="trade-item">
                <div>
                  <span className={trade.type === 'buy' ? 'trade-type-buy' : 'trade-type-sell'}>
                    {trade.type.toUpperCase()}
                  </span>
                  {' '}
                  {trade.amount} {trade.cryptocurrency}
                </div>
                <div>
                  <div>{formatCurrency(trade.totalCost)}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {formatDate(trade.timestamp)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-trades">
              No trades yet. Start trading to see your history!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
