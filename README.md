## Technologies
- Node
- Express
- MongoDB
    - Mongoose
- React
- ChakraUI
### Hosting
- Serverless
 - AWS Lambda
 - API Gateway

## Usage

### Deployment

This example is made to work with the Serverless Framework dashboard which includes advanced features like CI/CD, monitoring, metrics, etc.

```
$ serverless login
$ serverless deploy
```

To deploy without the dashboard you will need to remove `org` and `app` fields from the `serverless.yml`, and you won’t have to run `sls login` before deploying.

## Known Issues
- JWT is stored on local storage and could be susceptible XSS(cross site scripting) attack