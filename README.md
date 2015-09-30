# neo4j-passport-fb-example
To run this, you need to create a `config/secrets.js` file that looks like the following:

```javascript
module.exports = {
  "appID": "your-facebook-app-id",
  "appSecret": "your-facebook-app-secret",
  "callbackURL": "your-facebook-callback-url",
  "neo4jURL": "your-neo4j-url",
  "sessionSecret": "your-session-secret"
}
```
