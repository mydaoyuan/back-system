var express = require('express');
var router = express.Router();
var fs = require('fs');
const PATH = './public/data/';

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session.user) {
    return res.render('login', {});
  }
  res.render('index', { title: '管理中心' });
  // return res.send({
  //   status: 1,
  //   info: '测试服务2'
  // })
});
/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});
// edit page
router.get('/edit', function(req, res, next) {
  if (!req.session.user) {
    return res.render('login', {});
  }
  var type = req.param('type');
  var title;
  var obj = {};
  if (type) {
    // switch(type)
    //   {
    //   case 'it':
    //     title = '互联网'
    //     break;
    //   case 'huh':
    //     title = '笑料'
    //     break;
    //   case 'config':
    //     title = '管理'
    //     break;
    //   case 'text':
    //     title = '散文'
    //     break;
    //   default:
    //     title = '空'
    //   }
      fs.readFile(PATH + type +'.json', (err, data) => {
        if (err) {
          return res.send({
            status: 0,
            info: '读取文件错误'
          })
        }
        var obj = JSON.parse(data.toString());
        res.render('edit', {
          data: obj
        });
      })
  } else {
    return res.send({
      status:0,
      info: '参数错误'
    });
  }
});

module.exports = router;
