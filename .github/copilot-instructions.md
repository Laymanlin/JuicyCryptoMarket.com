# GitHub Copilot Instructions for JuicyCryptoMarket.com

## Project Overview

JuicyCryptoMarket.com is a cutting-edge cryptocurrency broker platform designed to simplify buying, selling, and managing cryptocurrencies. The platform aims to provide:
- Real-time cryptocurrency prices and market data
- Secure account creation and login functionality
- User-friendly interface for trading and managing assets
- Integration with leading cryptocurrency APIs for live trading

## Technology Stack

### Expected Technologies (to be implemented)
- **Frontend**: Modern JavaScript framework (React/Vue/Angular recommended)
- **Backend**: Node.js or similar for API services
- **Database**: Secure database for user accounts and transaction history
- **APIs**: Integration with cryptocurrency data providers
- **Authentication**: Secure email/password authentication with industry-standard practices

## Coding Standards and Conventions

### General Guidelines
- Write clean, maintainable, and well-documented code
- Follow industry-standard naming conventions for the chosen technology stack
- Use consistent indentation (prefer 2 spaces for JavaScript/TypeScript)
- Add meaningful comments for complex logic, especially around financial calculations
- Keep functions small and focused on a single responsibility

### Security Best Practices (CRITICAL for Crypto Platform)
- **NEVER** hardcode API keys, secrets, or credentials in source code
- Always use environment variables for sensitive configuration
- Implement proper input validation and sanitization on all user inputs
- Use prepared statements/parameterized queries to prevent SQL injection
- Implement rate limiting on API endpoints
- Use HTTPS for all communications
- Implement proper authentication and authorization checks
- Follow OWASP security guidelines for web applications
- Be especially careful with cryptocurrency addresses and transaction data
- Implement proper error handling without exposing sensitive information
- Use strong encryption for storing sensitive user data
- Implement multi-factor authentication where appropriate

### Code Quality
- Write unit tests for all business logic, especially financial calculations
- Ensure test coverage for critical paths (authentication, transactions, balance calculations)
- Run linters and formatters before committing code
- Keep dependencies up to date and monitor for security vulnerabilities
- Follow semantic versioning for releases

### Financial Data Handling
- Use appropriate data types for currency values (avoid floating-point arithmetic for money)
- Consider using libraries like `decimal.js` or `big.js` for precise financial calculations
- Always validate and sanitize cryptocurrency addresses
- Implement proper rounding and precision handling for different cryptocurrencies
- Log all financial transactions with proper audit trails

## File Organization

### Recommended Structure (when implementing)
```
/src
  /components      # Reusable UI components
  /pages          # Page-level components
  /services       # API and business logic services
  /utils          # Utility functions and helpers
  /config         # Configuration files
  /tests          # Test files
/public           # Static assets
/docs             # Documentation
```

## API and External Integrations

- Use established cryptocurrency API providers (CoinGecko, CoinMarketCap, Binance API, etc.)
- Implement proper error handling for API failures
- Cache API responses appropriately to reduce costs and latency
- Handle rate limits gracefully with retry logic
- Validate all data received from external APIs

## Testing Requirements

- Write unit tests for utility functions and business logic
- Write integration tests for API endpoints
- Test authentication and authorization flows thoroughly
- Test edge cases, especially for financial calculations
- Mock external API calls in tests
- Ensure tests are deterministic and don't depend on external services

## Documentation

- Maintain up-to-date README with setup instructions
- Document API endpoints with request/response examples
- Add inline documentation for complex algorithms
- Keep a CHANGELOG for tracking changes
- Document environment variables and configuration options

## Git and Version Control

- Use meaningful commit messages (follow conventional commits format)
- Create feature branches for new work
- Keep commits focused and atomic
- Don't commit sensitive data, build artifacts, or dependencies (node_modules, etc.)
- Review code before merging to main branch

## Performance Considerations

- Optimize API calls and reduce unnecessary requests
- Implement proper caching strategies
- Optimize database queries
- Use lazy loading for large datasets
- Monitor and optimize bundle sizes for frontend code

## Accessibility

- Follow WCAG guidelines for web accessibility
- Ensure keyboard navigation works properly
- Provide proper ARIA labels for screen readers
- Use semantic HTML elements
- Test with screen readers and accessibility tools

## Browser and Platform Support

- Support modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- Ensure responsive design for mobile devices
- Test on multiple screen sizes and devices
- Consider progressive web app (PWA) capabilities

## Compliance and Legal

- Ensure compliance with relevant financial regulations (KYC/AML where required)
- Implement proper data privacy measures (GDPR, CCPA compliance)
- Include necessary disclaimers and terms of service
- Maintain proper audit logs for regulatory requirements

## Contributing

When contributing to this project:
1. Follow the coding standards outlined above
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting pull requests
5. Security-focused code review is required for all changes

## License

This project is licensed under the Mozilla Public License Version 2.0. Ensure all contributions are compatible with this license.
