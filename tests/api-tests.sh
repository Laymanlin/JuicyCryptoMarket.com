#!/bin/bash
# API Integration Tests for Juicy Crypto Market

echo "🧪 Starting API Integration Tests..."
echo "=================================="

# Configuration
BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to run tests
run_test() {
    local test_name="$1"
    local command="$2"
    local expected_pattern="$3"
    
    echo ""
    echo "Testing: $test_name"
    
    result=$(eval "$command")
    
    if echo "$result" | grep -q "$expected_pattern"; then
        echo -e "${GREEN}✓ PASSED${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "Response: $result"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Test 1: Market Prices Endpoint
run_test "GET /api/market/prices" \
    "curl -s $API_URL/market/prices" \
    '"success":true'

# Test 2: Register New User
TIMESTAMP=$(date +%s)
TEST_EMAIL="test$TIMESTAMP@example.com"
run_test "POST /api/auth/register" \
    "curl -s -X POST $API_URL/auth/register -H 'Content-Type: application/json' -d '{\"name\":\"Test User\",\"email\":\"$TEST_EMAIL\",\"password\":\"testpass123\"}'" \
    '"success":true'

# Test 3: Login User
run_test "POST /api/auth/login" \
    "curl -s -X POST $API_URL/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"$TEST_EMAIL\",\"password\":\"testpass123\"}'" \
    '"token"'

# Get token for authenticated requests
TOKEN=$(curl -s -X POST $API_URL/auth/login -H 'Content-Type: application/json' -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"testpass123\"}" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Test 4: Get User Profile
run_test "GET /api/auth/profile (authenticated)" \
    "curl -s $API_URL/auth/profile -H 'Authorization: Bearer $TOKEN'" \
    '"success":true'

# Test 5: Place Buy Order
run_test "POST /api/trading/order (buy)" \
    "curl -s -X POST $API_URL/trading/order -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' -d '{\"type\":\"buy\",\"cryptocurrency\":\"bitcoin\",\"amount\":0.1,\"price\":45000}'" \
    '"success":true'

# Test 6: Place Sell Order
run_test "POST /api/trading/order (sell)" \
    "curl -s -X POST $API_URL/trading/order -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' -d '{\"type\":\"sell\",\"cryptocurrency\":\"ethereum\",\"amount\":1.0,\"price\":2500}'" \
    '"success":true'

# Test 7: Get User Orders
run_test "GET /api/trading/orders" \
    "curl -s $API_URL/trading/orders -H 'Authorization: Bearer $TOKEN'" \
    '"orders"'

# Test 8: Invalid Login
run_test "POST /api/auth/login (invalid credentials)" \
    "curl -s -X POST $API_URL/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"invalid@example.com\",\"password\":\"wrongpassword\"}'" \
    '"success":false'

# Test 9: Unauthorized Access
run_test "GET /api/auth/profile (unauthorized)" \
    "curl -s $API_URL/auth/profile" \
    '"success":false'

# Test 10: Invalid Order Type
run_test "POST /api/trading/order (invalid type)" \
    "curl -s -X POST $API_URL/trading/order -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' -d '{\"type\":\"invalid\",\"cryptocurrency\":\"bitcoin\",\"amount\":0.1,\"price\":45000}'" \
    '"success":false'

# Summary
echo ""
echo "=================================="
echo "Test Summary:"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo "=================================="

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
