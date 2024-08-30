const { S3Client } = require('@aws-sdk/client-s3')
const { Upload } = require('@aws-sdk/lib-storage')
const fs = require('fs')
const path = require('path')

const s3Client = new S3Client({ region: 'ap-southeast-1' })

const uploadFile = async fileName => {
  const filePath = path.join(__dirname, fileName)
  const fileStream = fs.createReadStream(filePath)

  fileStream.on('error', err => {
    console.error('File Error', err)
  })

  const uploadParams = {
    Bucket: 'widgets.getorbital.io',
    Key: `index.js`,
    Body: fileStream,
    ACL: 'public-read',
  }

  try {
    const parallelUploads3 = new Upload({
      client: s3Client,
      params: uploadParams,
    })

    parallelUploads3.on('httpUploadProgress', progress => {
      console.log(progress)
    })

    const data = await parallelUploads3.done()
    console.log('Upload Success', data.Location)
  } catch (err) {
    console.error('Upload Error', err)
    process.exit(1)
  }
}

// Upload the minified package for CDN
uploadFile('dist/index.umd.min.js').catch(err => {
  console.error('Unexpected Error', err)
  process.exit(1)
})
