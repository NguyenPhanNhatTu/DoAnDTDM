const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const app = express();
const port = 3000;
const route = require('./routes');
const db = require('./config/db/index');
const dbAWS = require('./config/db/indexAws');
//connnect 
db.connect();
dbAWS.connectAWS();
app.use(express.urlencoded({
  extended: true
}));

app.use(cors());
app.use(morgan());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined'));
app.use(methodOverride('_method'));
//Template engine
app.engine('hbs', handlebars({
  extname: '.hbs',
  helpers: {
    sum: (a, b) => a + b
  }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));
route(app);
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});