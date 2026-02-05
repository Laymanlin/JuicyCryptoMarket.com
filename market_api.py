"""
JuicyCryptoMarket.com - Cryptocurrency Market API
This version contains intentional performance issues to be optimized
"""
import time
import random
from datetime import datetime, timedelta


class CryptoMarket:
    """Main cryptocurrency market class with performance issues"""
    
    def __init__(self):
        self.cryptocurrencies = self._generate_crypto_data()
        self.users = self._generate_user_data()
        self.transactions = []
    
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
    
    # PERFORMANCE ISSUE #1: Inefficient search - O(n) linear search
    def get_user_by_email(self, email):
        """Get user by email - inefficient linear search"""
        for user in self.users:
            if user['email'] == email:
                return user
        return None
    
    # PERFORMANCE ISSUE #2: N+1 query problem
    def get_user_portfolios_with_prices(self):
        """Get all user portfolios with current prices - N+1 problem"""
        result = []
        for user in self.users:
            user_data = {'id': user['id'], 'email': user['email'], 'holdings': []}
            # This loops through portfolio for each user separately
            for crypto, amount in user['portfolio'].items():
                # Inefficient: fetching price for each crypto separately
                price = self.get_crypto_price(crypto)
                user_data['holdings'].append({
                    'crypto': crypto,
                    'amount': amount,
                    'value': amount * price
                })
            result.append(user_data)
        return result
    
    # PERFORMANCE ISSUE #3: Redundant calculations
    def calculate_market_statistics(self):
        """Calculate market statistics - redundant calculations"""
        stats = {}
        
        # Calculating multiple times instead of once
        total_market_cap = 0
        for crypto in self.cryptocurrencies.values():
            total_market_cap += crypto['market_cap']
        
        # Recalculating again
        total_volume = 0
        for crypto in self.cryptocurrencies.values():
            total_volume += crypto['volume']
        
        # And again for average
        avg_price = 0
        count = 0
        for crypto in self.cryptocurrencies.values():
            avg_price += crypto['price']
            count += 1
        avg_price = avg_price / count if count > 0 else 0
        
        stats['total_market_cap'] = total_market_cap
        stats['total_volume'] = total_volume
        stats['average_price'] = avg_price
        
        return stats
    
    # PERFORMANCE ISSUE #4: Inefficient data structure for lookups
    def get_crypto_price(self, symbol):
        """Get cryptocurrency price - already O(1) but called repeatedly"""
        return self.cryptocurrencies.get(symbol, {}).get('price', 0)
    
    # PERFORMANCE ISSUE #5: Blocking synchronous operation simulating slow API
    def fetch_external_market_data(self, symbol):
        """Simulate fetching from external API - blocking operation"""
        time.sleep(0.1)  # Simulate network delay
        return {
            'symbol': symbol,
            'last_updated': datetime.now().isoformat(),
            'price': random.uniform(100, 50000)
        }
    
    # PERFORMANCE ISSUE #6: Memory inefficient - creating new lists unnecessarily
    def get_top_cryptocurrencies(self, limit=10):
        """Get top cryptocurrencies by market cap - inefficient sorting"""
        # Creating multiple intermediate lists
        crypto_list = []
        for symbol, data in self.cryptocurrencies.items():
            crypto_list.append((symbol, data['market_cap']))
        
        # Sorting entire list even if we only need top N
        sorted_list = sorted(crypto_list, key=lambda x: x[1], reverse=True)
        
        # Creating another list for result
        result = []
        for i in range(min(limit, len(sorted_list))):
            symbol, market_cap = sorted_list[i]
            result.append({
                'symbol': symbol,
                'market_cap': market_cap,
                'price': self.cryptocurrencies[symbol]['price']
            })
        
        return result
    
    # PERFORMANCE ISSUE #7: String concatenation in loop
    def generate_market_report(self):
        """Generate market report - inefficient string concatenation"""
        report = ""
        report += "=== Crypto Market Report ===\n"
        report += f"Generated at: {datetime.now()}\n\n"
        
        # Inefficient string concatenation in loop
        for symbol, data in self.cryptocurrencies.items():
            report += f"Symbol: {symbol}\n"
            report += f"Price: ${data['price']:.2f}\n"
            report += f"Volume: ${data['volume']:.2f}\n"
            report += f"Market Cap: ${data['market_cap']:.2f}\n"
            report += "-" * 40 + "\n"
        
        return report
    
    # PERFORMANCE ISSUE #8: No caching for frequently accessed data
    def get_market_summary(self):
        """Get market summary - recalculated every time"""
        # This should be cached but isn't
        stats = self.calculate_market_statistics()
        top_cryptos = self.get_top_cryptocurrencies(5)
        
        return {
            'statistics': stats,
            'top_cryptos': top_cryptos,
            'timestamp': datetime.now().isoformat()
        }


def main():
    """Demo function showing performance issues"""
    print("Initializing Crypto Market...")
    market = CryptoMarket()
    
    print("\n=== Performance Issue Demonstrations ===\n")
    
    # Issue #1: Linear search
    print("1. Testing user lookup by email (linear search)...")
    start = time.time()
    for i in range(100):
        market.get_user_by_email(f'user{random.randint(0, 999)}@example.com')
    print(f"   Time for 100 lookups: {time.time() - start:.4f}s")
    
    # Issue #2: N+1 problem (commented out as it's very slow with 1000 users)
    # print("\n2. Testing portfolio fetching (N+1 problem)...")
    # start = time.time()
    # market.get_user_portfolios_with_prices()
    # print(f"   Time: {time.time() - start:.4f}s")
    
    # Issue #3: Redundant calculations
    print("\n3. Testing market statistics (redundant calculations)...")
    start = time.time()
    for i in range(1000):
        market.calculate_market_statistics()
    print(f"   Time for 1000 calls: {time.time() - start:.4f}s")
    
    # Issue #6: Inefficient sorting
    print("\n4. Testing top crypto sorting...")
    start = time.time()
    for i in range(1000):
        market.get_top_cryptocurrencies(5)
    print(f"   Time for 1000 calls: {time.time() - start:.4f}s")
    
    # Issue #7: String concatenation
    print("\n5. Testing report generation (string concatenation)...")
    start = time.time()
    for i in range(100):
        market.generate_market_report()
    print(f"   Time for 100 reports: {time.time() - start:.4f}s")
    
    print("\n=== Demo Complete ===")


if __name__ == "__main__":
    main()
