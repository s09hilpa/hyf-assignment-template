Reflection
1.Which auth mechanism would you choose for a SPA web app with many users?

I would choose JWT authentication.

Reasons:

JWT is stateless, so the server does not need to store sessions.
It scales well for many users and multiple servers.
It works well with frontend frameworks like React or Vue.
Tokens can be sent in the Authorization header for API requests.

I would not use:

Database tokens because they require database lookups on every request.
Sessions because scaling session storage across multiple servers is more complex.
API keys because they are not suitable for authenticating human users.

2.Which auth mechanism would you choose for microservice-to-microservice communication?

I would choose API keys or JWT service tokens.

Reasons:

Machine clients can easily send API keys in headers.
API keys are simple to implement.
JWT can also work well when services need signed claims and expiration.

I would not use:

Sessions because they are designed for browser users.
Password login because services should not log in like human users.

3.Which auth mechanism would you choose for an internal admin tool used by a small team?

I would choose session-based authentication.

Reasons:

Easy to implement and manage.
Good security for browser-based admin tools.
Easy logout and session invalidation.
Cookies work naturally in browser applications.

I would not use:

JWT because token revocation is harder.
API keys because they are not ideal for human authentication.

--Why would you not use the other mechanisms in those scenarios?

Different authentication methods solve different problems:

JWT is best for scalable APIs and SPAs.
Sessions are best for traditional browser apps.
API keys are best for machine-to-machine communication.
Database tokens are simpler but require database checks for every request.

Using the wrong method can create:

scalability problems,
security risks,
or unnecessary complexity.

--What is one security improvement you would like to make next if you had more time?

I would implement:

Refresh tokens
The most important next improvement would be refresh tokens, because they improve both security and user experience by allowing short-lived access tokens.