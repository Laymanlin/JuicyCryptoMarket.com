"""
JuicyCryptoMarket.com - Cryptocurrency Market API (Optimized Version)
This version fixes all performance issues from market_api.py
"""
import time
import random
from datetime import datetime, timedelta
from functools import lru_cache
import heapq
from typing import Dict, List, Optional


class CryptoMarketOptimized:
    """Optimized cryptocurrency market class with performance improvements"""
    
    def __init__(self):
        self.cryptocurrencies = self._generate_crypto_data()
        self.users_list = self._generate_user_data()
        # OPTIMIZATION #1: Use dictionary for O(1) lookups instead of O(n) search
        self.users_by_email = {user['email']: user for user in self.users_list}
        self.transactions = []
        # OPTIMIZATION #8: Add cache for market summary
        self._market_summary_cache = None
        self._cache_timestamp = None
        self._cache_ttl = 60  # Cache for 60 seconds
    
    def _generate_crypto_data(self):
        """Generate sample cryptocurrency data"""
        cryptos = ['BTC', 'ETH', 'XRP', 'LTC', 'ADA', 'DOT', 'LINK', 'BCH', 'XLM', 'DOGE']
        data = {}
        for crypto in cryptos:
            data[crypto] = {
                'name': crypto,
                'price': random.uniform(100, 50000),
                'volume': random.uniform(1000000, 100000000),
                'market_cap': random.uniform(1000000000, 1000000000000)
            }
        return data
    
    def _generate_user_data(self):
        """Generate sample user data"""
        users = []
        for i in range(1000):
            users.append({
                'id': i,
                'email': f'user{i}@example.com',
                'balance': random.uniform(100, 100000),
                'portfolio': {}
            })
        return users
    
    # OPTIMIZATION #1: O(1) dictionary lookup instead of O(n) linear search
    def get_user_by_email(self, email: str) -> Optional[Dict]:
        """Get user by email - optimized with dictionary lookup"""
        return self.users_by_email.get(email)
    
    # OPTIMIZATION #2: Batch processing to avoid N+1 query problem
    def get_user_portfolios_with_prices(self) -> List[Dict]:
        """Get all user portfolios with current prices - optimized batch processing"""
        result = []
        # Pre-fetch all prices once (simulating batch query)
        price_cache = {symbol: data['price'] for symbol, data in self.cryptocurrencies.items()}
        
        for user in self.users_list:
            user_data = {'id': user['id'], 'email': user['email'], 'holdings': []}
            # Use cached prices instead of fetching individually
            for crypto, amount in user['portfolio'].items():
                price = price_cache.get(crypto, 0)
                user_data['holdings'].append({
                    'crypto': crypto,
                    'amount': amount,
                    'value': amount * price
                })
            result.append(user_data)
        return result
    
    # OPTIMIZATION #3: Single pass calculation instead of multiple loops
    def calculate_market_statistics(self) -> Dict:
        """Calculate market statistics - optimized single pass"""
        total_market_cap = 0
        total_volume = 0
        total_price = 0
        count = 0
        
        # Single loop to calculate everything at once
        for crypto in self.cryptocurrencies.values():
            total_market_cap += crypto['market_cap']
            total_volume += crypto['volume']
            total_price += crypto['price']
            count += 1
        
        return {
            'total_market_cap': total_market_cap,
            'total_volume': total_volume,
            'average_price': total_price / count if count > 0 else 0
        }
    
    def get_crypto_price(self, symbol: str) -> float:
        """Get cryptocurrency price - already O(1)"""
        return self.cryptocurrencies.get(symbol, {}).get('price', 0)
    
    # OPTIMIZATION #4: Async simulation (in real app, use async/await)
    # For now, we'll show the concept with batch fetching
    def fetch_external_market_data_batch(self, symbols: List[str]) -> Dict:
        """Simulate batch fetching from external API - reduces API calls"""
        # In a real implementation, this would be async with asyncio
        # For demo, we just fetch all at once with single delay
        time.sleep(0.1)  # Single network delay instead of one per symbol
        results = {}
        for symbol in symbols:
            results[symbol] = {
                'symbol': symbol,
                'last_updated': datetime.now().isoformat(),
                'price': random.uniform(100, 50000)
            }
        return results
    
    # OPTIMIZATION #6: Use heapq for efficient top-N selection
    def get_top_cryptocurrencies(self, limit: int = 10) -> List[Dict]:
        """Get top cryptocurrencies by market cap - optimized with heapq"""
        # Use heapq.nlargest for efficient top-N selection O(n log k) instead of O(n log n)
        top_items = heapq.nlargest(
            limit,
            self.cryptocurrencies.items(),
            key=lambda x: x[1]['market_cap']
        )
        
        # Build result in single pass
        return [
            {
                'symbol': symbol,
                'market_cap': data['market_cap'],
                'price': data['price']
            }
            for symbol, data in top_items
        ]
    
    # OPTIMIZATION #7: Use list and join instead of string concatenation
    def generate_market_report(self) -> str:
        """Generate market report - optimized with list join"""
        lines = [
            "=== Crypto Market Report ===",
            f"Generated at: {datetime.now()}",
            ""
        ]
        
        # Build list of strings and join once at the end
        for symbol, data in self.cryptocurrencies.items():
            lines.extend([
                f"Symbol: {symbol}",
                f"Price: ${data['price']:.2f}",
                f"Volume: ${data['volume']:.2f}",
                f"Market Cap: ${data['market_cap']:.2f}",
                "-" * 40
            ])
        
        return "\n".join(lines)
    
    # OPTIMIZATION #8: Implement caching for frequently accessed data
    def get_market_summary(self) -> Dict:
        """Get market summary - optimized with caching"""
        now = time.time()
        
        # Check if cache is valid
        if (self._market_summary_cache is not None and 
            self._cache_timestamp is not None and 
            now - self._cache_timestamp < self._cache_ttl):
            return self._market_summary_cache
        
        # Calculate and cache
        stats = self.calculate_market_statistics()
        top_cryptos = self.get_top_cryptocurrencies(5)
        
        self._market_summary_cache = {
            'statistics': stats,
            'top_cryptos': top_cryptos,
            'timestamp': datetime.now().isoformat()
        }
        self._cache_timestamp = now
        
        return self._market_summary_cache
    
    def invalidate_cache(self):
        """Invalidate the cache when data changes"""
        self._market_summary_cache = None
        self._cache_timestamp = None


def compare_performance():
    """Compare performance between original and optimized versions"""
    from market_api import CryptoMarket
    
    print("=== Performance Comparison ===\n")
    
    # Initialize both versions
    print("Initializing markets...")
    market_original = CryptoMarket()
    market_optimized = CryptoMarketOptimized()
    
    print("\n" + "=" * 60)
    print("1. USER LOOKUP BY EMAIL (1000 lookups)")
    print("=" * 60)
    
    # Original version
    start = time.time()
    for i in range(1000):
        market_original.get_user_by_email(f'user{random.randint(0, 999)}@example.com')
    time_original = time.time() - start
    print(f"Original (linear search):  {time_original:.4f}s")
    
    # Optimized version
    start = time.time()
    for i in range(1000):
        market_optimized.get_user_by_email(f'user{random.randint(0, 999)}@example.com')
    time_optimized = time.time() - start
    print(f"Optimized (dict lookup):   {time_optimized:.4f}s")
    print(f"Speedup: {time_original/time_optimized:.2f}x faster")
    
    print("\n" + "=" * 60)
    print("2. MARKET STATISTICS (1000 calculations)")
    print("=" * 60)
    
    # Original version
    start = time.time()
    for i in range(1000):
        market_original.calculate_market_statistics()
    time_original = time.time() - start
    print(f"Original (multiple loops): {time_original:.4f}s")
    
    # Optimized version
    start = time.time()
    for i in range(1000):
        market_optimized.calculate_market_statistics()
    time_optimized = time.time() - start
    print(f"Optimized (single loop):   {time_optimized:.4f}s")
    print(f"Speedup: {time_original/time_optimized:.2f}x faster")
    
    print("\n" + "=" * 60)
    print("3. TOP CRYPTOCURRENCIES (1000 queries)")
    print("=" * 60)
    
    # Original version
    start = time.time()
    for i in range(1000):
        market_original.get_top_cryptocurrencies(5)
    time_original = time.time() - start
    print(f"Original (full sort):      {time_original:.4f}s")
    
    # Optimized version
    start = time.time()
    for i in range(1000):
        market_optimized.get_top_cryptocurrencies(5)
    time_optimized = time.time() - start
    print(f"Optimized (heapq):         {time_optimized:.4f}s")
    print(f"Speedup: {time_original/time_optimized:.2f}x faster")
    
    print("\n" + "=" * 60)
    print("4. REPORT GENERATION (1000 reports)")
    print("=" * 60)
    
    # Original version
    start = time.time()
    for i in range(1000):
        market_original.generate_market_report()
    time_original = time.time() - start
    print(f"Original (string concat):  {time_original:.4f}s")
    
    # Optimized version
    start = time.time()
    for i in range(1000):
        market_optimized.generate_market_report()
    time_optimized = time.time() - start
    print(f"Optimized (list join):     {time_optimized:.4f}s")
    print(f"Speedup: {time_original/time_optimized:.2f}x faster")
    
    print("\n" + "=" * 60)
    print("5. MARKET SUMMARY WITH CACHING (100 calls)")
    print("=" * 60)
    
    # Original version (no caching)
    start = time.time()
    for i in range(100):
        market_original.get_market_summary()
    time_original = time.time() - start
    print(f"Original (no cache):       {time_original:.4f}s")
    
    # Optimized version (with caching)
    start = time.time()
    for i in range(100):
        market_optimized.get_market_summary()
    time_optimized = time.time() - start
    print(f"Optimized (cached):        {time_optimized:.4f}s")
    print(f"Speedup: {time_original/time_optimized:.2f}x faster")
    
    print("\n" + "=" * 60)
    print("OVERALL SUMMARY")
    print("=" * 60)
    print("✓ Dictionary lookup: O(n) → O(1)")
    print("✓ Multiple loops: O(3n) → O(n)")
    print("✓ Full sort: O(n log n) → O(n log k)")
    print("✓ String concatenation: Optimized with join")
    print("✓ Caching: Added for frequently accessed data")
    print("✓ N+1 queries: Batched for efficiency")


if __name__ == "__main__":
    compare_performance()
