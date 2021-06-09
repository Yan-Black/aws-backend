const middy = require('middy');
const { cors } = require('middy/middlewares');
const { generatePolicy } = require('../helpers/generatePolicy');

const handler = async (event, _, cb) => {
  if (event['type'] === 'TOKEN') {
    try {
      const { authorizationToken } = event;

      console.log(`Received AuthToken: ${authorizationToken}`);

      const encodedCreds = authorizationToken.split(' ')[1];
      const buff = Buffer.from(encodedCreds, 'base64');
      const plainCreds = buff.toString('utf-8').split(':');
      const [username, password] = plainCreds;

      console.log(
        `Received Creds --> Username: ${username}, Password: ${password}`
      );

      const storedUserPassword = process.env[username];
      const effect =
        storedUserPassword && storedUserPassword === password
          ? 'Allow'
          : 'Deny';

      const policy = generatePolicy(encodedCreds, event.methodArn, effect);

      cb(null, policy);
    } catch ({ message }) {
      cb(`Unauthorized ${message}`);
    }
  } else {
    cb(`Unauthorized`);
  }
};

module.exports.basicAuthorizer = middy(handler).use(cors());
