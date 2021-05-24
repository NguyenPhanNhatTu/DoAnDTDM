const AWS = require('aws-sdk');
async function connectAWS() {
  try {
    var awsConfig = {
        "region": "ap-southeast-1",
        "accessKeyId":"AKIAUJD3ECR5YMTNKKOM",
        "secretAccessKey": "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"
    }
    AWS.config.update(awsConfig);

    console.log('Success Aws');
  } 
  catch (error) {
    console.log('fail');
  }
}
module.exports ={connectAWS};