const managers = require('../../importModule')

const awsRequest = (req, res, S3_BUCKET, aws) => {
    const s3 = new aws.S3({
        apiVersion: '2006-03-01',
        signatureVersion: 'v4',})
    const fileName = req.query['file-name']
    const fileType = req.query['file-type']
    const id = req.query['id']
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    }
    
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
        console.log(err)
        return res.end()
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      }
      if (fileName.substring(0,3) === 'ETU') {
            managers.StudentManager.updateImageUrl(fileName, id)    
      } else if(fileName.substring(0,3) === 'VID'){
            managers.EnterpriseManager.updateVideo(id,fileName)
      } else if(fileName.substring(0,3) === 'ECV'){
            managers.StudentManager.updateCVUrl(fileName, id)
      } else {
            managers.EnterpriseManager.updateLogo(id,fileName)
      }
      
      res.write(JSON.stringify(returnData))
      res.end()
    })
}

module.exports = {
    awsRequest: awsRequest
}