## Tech used

#### Backend:
- Node
- Express
- MongoDB
    - Mongoose
#### Hosting:
- Serverless
 - AWS Lambda
 - API Gateway
 
#### Frontend:
- React
- ChakraUI

#### Hosting:
- Netlify

## API Features

- Tweets
    - Create tweets 
    - Delete only your tweets
    - Like and Retweet
    - Track who liked and retweeted
    - Get feed
    - Get user feed
- Authentication
    - Register user
    - Log in securely with JWT
    - Verify by email
## Usage

### Deployment

```
$ git clone https://github.com/wAndrewx/kebab-api.git
$ npm i 
$ serverless login
$ serverless deploy
```
## Offline Development
Make sure you have serverless-offline; recreates how AWS would handle lambda functions on your local machine to speed up your development cycles.

```
$ git clone https://github.com/wAndrewx/kebab-api.git
$ npm i
$ sls offline
```

To deploy without the dashboard you will need to remove `org` and `app` fields from the `serverless.yml`, and you won’t have to run `sls login` before deploying.

## Known Issues
- Tests will not pass on serverless, due to not being able to connect to mongoDB, but will pass on locally
- JWT is stored on local storage and could be susceptible XSS(cross site scripting) attack
