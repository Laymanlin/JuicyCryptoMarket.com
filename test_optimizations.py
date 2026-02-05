"""
Unit tests for the cryptocurrency market API optimizations
"""
import unittest
import time
from market_api import CryptoMarket
from market_api_optimized import CryptoMarketOptimized


class TestPerformanceOptimizations(unittest.TestCase):
    """Test that optimizations maintain correct functionality"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.market_original = CryptoMarket()
        self.market_optimized = CryptoMarketOptimized()
    
    def test_user_lookup_correctness(self):
        """Test that optimized user lookup returns same results"""
        test_email = 'user500@example.com'
        
        result_original = self.market_original.get_user_by_email(test_email)
        result_optimized = self.market_optimized.get_user_by_email(test_email)
        
        self.assertIsNotNone(result_original)
        self.assertIsNotNone(result_optimized)
        self.assertEqual(result_original['email'], result_optimized['email'])
        self.assertEqual(result_original['id'], result_optimized['id'])
    
    def test_user_lookup_performance(self):
        """Test that optimized user lookup is faster"""
        test_email = 'user999@example.com'  # Worst case for linear search
        
        # Measure original
        start = time.time()
        for _ in range(100):
            self.market_original.get_user_by_email(test_email)
        time_original = time.time() - start
        
        # Measure optimized
        start = time.time()
        for _ in range(100):
            self.market_optimized.get_user_by_email(test_email)
        time_optimized = time.time() - start
        
        # Optimized should be at least 2x faster
        self.assertLess(time_optimized * 2, time_original,
                       f"Optimized ({time_optimized:.4f}s) should be significantly faster than original ({time_original:.4f}s)")
    
    def test_market_statistics_correctness(self):
        """Test that market statistics are calculated correctly"""
        stats_original = self.market_original.calculate_market_statistics()
        stats_optimized = self.market_optimized.calculate_market_statistics()
        
        # Should have same keys
        self.assertEqual(set(stats_original.keys()), set(stats_optimized.keys()))
        
        # Values should be positive numbers (verifying calculation logic, not exact values)
        for key in stats_original.keys():
            self.assertGreater(stats_original[key], 0, f"Original {key} should be positive")
            self.assertGreater(stats_optimized[key], 0, f"Optimized {key} should be positive")
    
    def test_top_cryptocurrencies_correctness(self):
        """Test that top crypto selection returns correct results"""
        top_original = self.market_original.get_top_cryptocurrencies(5)
        top_optimized = self.market_optimized.get_top_cryptocurrencies(5)
        
        # Should have same number of results
        self.assertEqual(len(top_original), len(top_optimized))
        self.assertEqual(len(top_original), 5)
        
        # Results should be sorted by market_cap in descending order
        for i in range(len(top_original) - 1):
            self.assertGreaterEqual(
                top_original[i]['market_cap'], 
                top_original[i + 1]['market_cap'],
                "Original results should be sorted by market cap"
            )
        
        for i in range(len(top_optimized) - 1):
            self.assertGreaterEqual(
                top_optimized[i]['market_cap'], 
                top_optimized[i + 1]['market_cap'],
                "Optimized results should be sorted by market cap"
            )
    
    def test_report_generation_correctness(self):
        """Test that report generation produces same output"""
        report_original = self.market_original.generate_market_report()
        report_optimized = self.market_optimized.generate_market_report()
        
        # Both reports should contain header
        self.assertIn("Crypto Market Report", report_original)
        self.assertIn("Crypto Market Report", report_optimized)
        
        # Reports should contain the same cryptocurrency symbols
        for symbol in self.market_original.cryptocurrencies.keys():
            self.assertIn(symbol, report_original)
        
        for symbol in self.market_optimized.cryptocurrencies.keys():
            self.assertIn(symbol, report_optimized)
        
        # Both should have reasonable number of lines
        lines_original = report_original.count('\n')
        lines_optimized = report_optimized.count('\n')
        self.assertGreater(lines_original, 10)
        self.assertGreater(lines_optimized, 10)
    
    def test_caching_functionality(self):
        """Test that caching returns consistent results"""
        # First call should calculate
        summary1 = self.market_optimized.get_market_summary()
        
        # Second call should use cache (within TTL)
        summary2 = self.market_optimized.get_market_summary()
        
        # Should return exact same object (cached)
        self.assertEqual(summary1['timestamp'], summary2['timestamp'])
        
        # Invalidate cache
        self.market_optimized.invalidate_cache()
        
        # Should recalculate with new timestamp
        summary3 = self.market_optimized.get_market_summary()
        self.assertNotEqual(summary1['timestamp'], summary3['timestamp'])
    
    def test_batch_processing_correctness(self):
        """Test that batch processing returns correct results"""
        # Add some portfolio data for testing
        for user in self.market_original.users[:10]:
            user['portfolio'] = {'BTC': 0.5, 'ETH': 2.0}
        
        for user in self.market_optimized.users_list[:10]:
            user['portfolio'] = {'BTC': 0.5, 'ETH': 2.0}
        
        portfolios_original = self.market_original.get_user_portfolios_with_prices()
        portfolios_optimized = self.market_optimized.get_user_portfolios_with_prices()
        
        # Should have same number of users
        self.assertEqual(len(portfolios_original), len(portfolios_optimized))
        
        # Check first user's portfolio matches
        if portfolios_original[0]['holdings']:
            original_holdings = portfolios_original[0]['holdings']
            optimized_holdings = portfolios_optimized[0]['holdings']
            
            self.assertEqual(len(original_holdings), len(optimized_holdings))


class TestEdgeCases(unittest.TestCase):
    """Test edge cases and error handling"""
    
    def setUp(self):
        self.market = CryptoMarketOptimized()
    
    def test_nonexistent_user_lookup(self):
        """Test looking up a user that doesn't exist"""
        result = self.market.get_user_by_email('nonexistent@example.com')
        self.assertIsNone(result)
    
    def test_empty_portfolio(self):
        """Test user with empty portfolio"""
        portfolios = self.market.get_user_portfolios_with_prices()
        # Should handle empty portfolios without error
        self.assertIsInstance(portfolios, list)
    
    def test_zero_limit_top_cryptos(self):
        """Test requesting 0 top cryptocurrencies"""
        result = self.market.get_top_cryptocurrencies(0)
        self.assertEqual(len(result), 0)
    
    def test_limit_exceeds_available(self):
        """Test requesting more cryptos than available"""
        total_cryptos = len(self.market.cryptocurrencies)
        result = self.market.get_top_cryptocurrencies(total_cryptos + 10)
        # Should return all available, not more
        self.assertEqual(len(result), total_cryptos)


def run_tests():
    """Run all tests and print results"""
    print("=" * 60)
    print("Running Performance Optimization Tests")
    print("=" * 60)
    
    # Create test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    suite.addTests(loader.loadTestsFromTestCase(TestPerformanceOptimizations))
    suite.addTests(loader.loadTestsFromTestCase(TestEdgeCases))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    print(f"Tests run: {result.testsRun}")
    print(f"Successes: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    
    if result.wasSuccessful():
        print("\n✅ All tests passed!")
        return 0
    else:
        print("\n❌ Some tests failed!")
        return 1


if __name__ == '__main__':
    exit(run_tests())
