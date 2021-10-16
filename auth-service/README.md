# CBI REST API Service

The authentication endpoints provide the core for all CBI access control. This includes such tasks as registration, login, verification, password changes and lost password retrievals.

## Authorization
CBI uses a token-based HTTP Authentication scheme.

Once a user has logged in and received a token, each subsequent request should include the token in the HTTP Authorization header.

Tokens expire 6 hours after creation. Once a token has expired, login is required in order to re-authenticate.

CBI’s tokens allow for a single user to have multiple active tokens on separate devices as well as the ability for admin users to create tokens that do not expire.

For security reasons CBI will only expose the token once, on login or on register, and never again. Be sure to store it somewhere safe.

### Authorization Header

When making requests, the API key should be included as a token in the Authorization header:

Authorization: Token {token}

You must replace {token} with your API token.