var express = require('express');
var router = express.Router();
var fs = require('fs');
const PATH = './public/data/';

// 读取data json
// data/read?type=it;
router.get('/read', (req, res, next) => {
  var type = req.param('type');
  fs.readFile(PATH + type + '.json', (err,data) => {
    if (err) {
      return res.send({
        status: 0,
        info: '读取文件失败'
      });
    }
    const COUNT = 50;
    var obj = [];
    try {
      obj = JSON.parse(data.toString());
    }catch(e) {
      obj = [];
    }
    if (obj.length > 50) {
      obj.slice(0, COUNT);
    }
    return res.send({
      status: 1,
      data: obj
    })
  });

});

// 写入data json
// data/write?type=it&title=tang&img=xx&url=xxx.png;
router.post('/write', (req, res, next) => {
  if (!req.session.user) {
    return res.send({
      status: 0,
      info: '请先登录账户'
    })
  }
  // 文件名
  var type = req.param('type') || '';
  // 参数
  var title = req.param('title') || '';
  var img = req.param('img') || '';
  var url = req.param('url') || '';
  var filePath = PATH + type + '.json';
  // 读取文件
  if (!title || !img || !url || !type) {
    return res.send({
      status: 0,
      info: '参数不全'
    })
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.send({
        status: 0,
        info: '读取文件错误'
      })
    }
    var arr = JSON.parse(data.toString());
    var dataobj = {
      title,
      url,
      img,
      id: guidGenerate(),
      time: new Date()
    };
    arr.unshift(dataobj);
    var newdata = JSON.stringify(arr);
    fs.writeFile(filePath, newdata, (err) => {
      if (err) {
        return res.send({
          status: 0,
          info: '写入错误'
        })
      }
      return res.send({
        status: 1,
        data: newdata
      })
    })
  })
})

// 登录接口
router.post('/login_in', (req, res, next) => {
  // 用户名 密码
  var username = req.body.username;
  var password = req.body.password;
  // todo: 对用户名密码校验,xss防御,判空,密码加密 md5(password + 随机字符串)
  if (username === 'tang' && password === '123') {
    // console.log(req.session)
    req.session.user = {
      username: username
    };
    return res.send({
      status: 1,
      data: req.session
    })
    // res.render('index');
  }
  return res.send({
    status: 0,
    info: '登录失败',
    data: {
      username,
      password
    }
  })
})


router.post('/write_config', (req, res, next) => {
  // 缺少验证
  let data = req.body.data;
  let obj = JSON.parse(data);
  // let obj = JSON.parse(data);
  // let newdata = JSON.stringify(obj);
  fs.wirteFile(PATH + '/write_config', data, (err) => {
    if (err) {
      return res.send({
        status: 0,
        info: '数据写入错误'
      })
    }
    return res.send({
      status: 1,
      info: obj
    })
  })
})



//guid 生成唯一ID
function guidGenerate() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  }).toUpperCase();
}
module.exports = router;
