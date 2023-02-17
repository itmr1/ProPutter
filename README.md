# ProPutter
Smart Golf Club

As usual, node_modules folder created on node js app creation excluded from commits.

back-end + device communication incorporates HTTPS with self-signed ssl certificate for development testing purposes. For development, it is more complex to integrate
self-signed ssl in React (It's not possible for the browser to interpret and run some Node server-side modules like fs) Therefore http used in frontend solely for development + testing until a CA certificate is obtained.
In production, a Certificate authority (CA) verified certificate can be bought and used for all end-to-end communications, and to further add trust when validating a server's authenticity. 
