class NewsController {
  //[Get] /news
  index(req, res) {
    res.render('news');
  }
  show(req, res) {
    res.send('Data ');
  }
}

module.exports = new NewsController();
// const newcontroller= require('/.NewsController')
