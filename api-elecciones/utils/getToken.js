const axios = require("axios").default;

const getToken = async () => {
  const data = {
    AuthParameters: {
      USERNAME: "prensa112",
      PASSWORD: "@TNxD7RN#5W4ta",
    },
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: "f0dapcjldcsbslvnnqhtvngjs",
    UserPoolId: "us-east-1_xp4TpXSkw",
  };

  const headers = {
    "Content-Type": "application/x-amz-json-1.1",
    "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
  };

  axios.defaults.headers = headers;

  const response = await axios.post(
    "https://cognito-idp.us-east-1.amazonaws.com/",
    data
  );

  return response.data.AuthenticationResult.AccessToken;
};

exports.getToken = getToken;
