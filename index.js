const express = require('express')
const app = express()
app.listen(process.env.PORT || 3000, ()=> {})
const aws = require('aws-sdk')
aws.config.update({
  accessKeyId: process.env.awsAccessKeyId,
  secretAccessKey: process.env.awsSecretAccessKey,
  region: 'ap-northeast-1'
});
const s3 = new aws.S3()

//クロスドメイン許可
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next();
});

async function getFileName(name) {
  return new Promise((resolve) => {

    const params2 = {
      Bucket: 'mrble-portfolio',
      Prefix: 'purichan/' + name + '/'
    }

    s3.listObjectsV2(params2, (err, data) => {
      if (err) {
        console.log("Error", err)
        resolve('Error')
      } else {
        const fileList = data.Contents
        fileList.shift()
        resolve('https://s3-ap-northeast-1.amazonaws.com/mrble-portfolio/' + fileList[Math.floor(Math.random() * fileList.length )].Key)
      }
    })
  })
}

app.get('/getFileName', (req, res) => {
  const name = req.query.name
  let filePath
  switch(name) {
    case 'mirai':
    case 'emo':
    case 'rinka':
      getFileName(name).then((result) => {
        res.send(result)
      })
    break
    default:
      res.send('存在しないリクエスト')
      break
  }
})

app.get('/viewFile', (req, res) => {
  const name = req.query.name
  let filePath
  switch(name) {
    case 'mirai':
    case 'emo':
    case 'rinka':
      getFileName(name).then((result) => {
        res.send("<p>" +result+ "</p><img src='" +result+ "'>")
      })
    break
    default:
      res.send('存在しないリクエスト')
      break
  }
})

async function getFileList(name) {
  return new Promise((resolve) => {

    const params2 = {
      Bucket: 'mrble-portfolio',
      Prefix: 'purichan/' + name + '/'
    }

    s3.listObjectsV2(params2, (err, data) => {
      if (err) {
        console.log("Error", err)
        resolve('Error')
      } else {
        const fileList = data.Contents
        fileList.shift()
        resolve(fileList)
      }
    })
  })
}

app.get('/fileList', (req, res) => {
  const name = req.query.name
  let filePath
  switch(name) {
    case 'mirai':
    case 'emo':
    case 'rinka':
      getFileList(name).then((result) => {
        let resData = ''
        result.forEach((data) => {
          resData += '<li style="list-style: none;"><p>▼'+ data.Key +'</p><img width="300" src="https://s3-ap-northeast-1.amazonaws.com/mrble-portfolio/' +data.Key+ '"></li>'
        })
        res.send(
          "<ul>"+ resData +"</ul>"
        )
      })
    break
    default:
      res.send('存在しないリクエスト')
      break
  }
})
