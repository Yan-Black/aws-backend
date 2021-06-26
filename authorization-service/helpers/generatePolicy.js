module.exports.generatePolicy = (principalId, Resource, Effect = 'Allow') => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect,
        Resource
      }
    ]
  }
});
