var createError = require('http-errors');
const moment = require('moment');
const logger1=require('./logger1')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var app = express();
app.use(express.static('public'));
app.use(express.static('files'));
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded( { extended:false}))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method' )
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE')
  res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE')
  next();
  });
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { log } = require('console');
var mysql = require('mysql');
const e = require('express');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '13945958166+wst',
  database: 'food'
});
connection.connect((err) => {
  if(err){
    throw err;
  }
  console.log('Mysql connection ....');
}) 
var Vipconnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '13945958166+wst',
  database: 'Vip'
});
app.use(logger1);
/* connection.connect()
connection.query('SELECT * From food', function (err, rows, fields) {
  if (err) throw err
  console.log('The solution is: ', rows);
  result=JSON.stringify(rows);
  res.end(result);
}) */

/* connection.end(); */
app.get('/food', function (req, res,next) {
  res.writeHead(200, {
    "Content-Type": "text/html;charset=utf-8"
  });
 const a='*';
  connection.query(`SELECT ${a} From food`, function (err, rows, fields) {
    if (err) throw err
    result=JSON.stringify(rows);
    res.end(result);
  })
}) 
app.get('/food1',(req , res) => {
  let post = { food_id:12,food_name:"test",food_star:6 };
  let sql = 'INSERT INTO food SET ?';
  let query=connection.query(sql, post, (err,result) => {
    if(err) throw err;
    console.log(result);
    res.send("Post 1 Add")
  })
})
app.get('/food/:id',(req , res , next) => {
  connection.query(`SELECT ${req.params.id} From food`, function (err, rows, fields) {
    if (err) throw err
    result=JSON.stringify(rows);
    res.end(result);
  })
})
app.get('/foodAdd/:id/:name/:star/:address/:store/:suggestion',(req , res , next) => {
  connection.query(`INSERT INTO food(food_id, food_name, food_star,food_address, food_store, food_suggestion) VALUES (${req.params.id},' ${req.params.name}', ${req.params.star}, '${req.params.address}', '${req.params.store}', '${req.params.suggestion}') `, function (err, rows, fields) {
    if (err) throw err
    result=JSON.stringify(rows);
    res.end(result);
  })
})
app.get('/foodU/:id/:name/:star/:address/:store/:suggestion',(req , res , next) => {
  connection.query(`UPDATE food SET food_name ='${req.params.name}' WHERE food_id =${req.params.id}`  , function (err, rows, fields) {
    if (err) throw err
    result=JSON.stringify(rows);
    res.end(result);
  })
})


app.post("/vipregister", (req, res) => {

  const vip_name = req.body.vip_name;
  const vip_password = req.body.vip_password;
  Vipconnection.query("INSERT INTO vip_init (vip_name,vip_password) VALUES (?,?)",
  [vip_name, vip_password],
  (err, result) => {
    console.log(err);
  }
  );
});

app.post("/viplogin", (req,res) => {
  const vip_name = req.body.vip_name;
  const vip_password = req.body.vip_password;
  Vipconnection.query(" SELECT * FROM vip_init WHERE vip_name = ? AND vip_password = ?",
  [vip_name, vip_password],
  (err, result) => {
    if(err)
    res.send({err:err})
      if (result.length >0) {
        res.send(result)
      } else {
        res.send({message : "Wrong username/password cobination!"})
      }
    
  }
  );

})
app.get('/vip', function (req, res,next) {
  res.writeHead(200, {
    "Content-Type": "text/html;charset=utf-8"
  });
  Vipconnection.query('SELECT * From vip_init', function (err, rows, fields) {
    if (err) throw err
  
    result=JSON.stringify(rows);
    res.end(result);
  })
}) 
app.post('/vip_count', function (req, res,next) {
  const vip_name = req.body.vip_name;
  Vipconnection.query('SELECT vip_count.vip_count_present,vip_count.vip_count from vip_count ,vip_init WHERE vip_init.vip_count>=vip_count.vip_count and vip_name=?',[vip_name],  (err, Result) => {
    if (err) throw err
    result=JSON.stringify(Result);
    res.end(result);
  })
})
app.post('/vipcountchange', function (req, res, next) {
  const vip_name = req.body.vip_name;
  const count = req.body.count;
  Vipconnection.query(`UPDATE vip_init SET vip_count = vip_count - ? WHERE vip_name = ?`,[count,vip_name], (err, Result) => {
    if (err) throw err
    result=JSON.stringify(Result);
    res.send(Result);
  })
}) 
app.post('/vipinfo', function (req, res, next) {
  const vip_name = req.body.vip_name;
  console.log(vip_name);
  console.log("shabi");
  console.log(vip_name);
  Vipconnection.query(`SELECT * From vip_init WHERE vip_name = ?`,[vip_name], (err, Result) => {
    if (err) throw err
    result=JSON.stringify(Result);
    res.send(Result);
  })
}) 
app.post('/vip/:id', function (req, res,next) {
  const vip_name = req.body.vip_name;
  console.log("shabi");
  console.log(vip_name);
  Vipconnection.query(`SELECT ${req.params.id} From vip_init WHERE vip_name = ?`,[vip_name], (err, Result) => {
    if (err) throw err
    /* result=JSON.stringify(Result); */
    res.send(Result);
  })
}) 
app.post('/viplevelname', function (req, res,next) {
  const vip_name = req.body.vip_name;
  console.log("shabi");
  console.log(vip_name);
  Vipconnection.query(`SELECT name from vip_init NATURAL JOIN vip_level_name WHERE vip_name = ?`,[vip_name], (err, Result) => {
    if (err) throw err
    /* result=JSON.stringify(Result); */
    res.send(Result);
  })
}) 
app.post('/vip_course_count', function (req, res,next) {
  const vip_name = req.body.vip_name;
  console.log("shabi");
  console.log(vip_name);
  Vipconnection.query(`SELECT COUNT(lession_id) as coo From vip_course WHERE vip_name = ?`,[vip_name], (err, Result) => {
    if (err) throw err
    /* result=JSON.stringify(Result); */
    res.send(Result);
  })
}) 
app.post('/viplevelupdate', function (req, res,next) {
  const vip_name = req.body.vip_name;
  console.log("shabi");
  console.log(vip_name);
  Vipconnection.query(`UPDATE vip_init set vip_level=(select vip_level from vip_level_name where (SELECT COUNT(lession_id) from vip_course WHERE vip_name=?) BETWEEN vip_level_name.vip_course_low and  vip_level_name.vip_course_high) where vip_name=?`,[vip_name,vip_name], (err, Result) => {
    if (err) throw err
    /* result=JSON.stringify(Result); */
    res.send(Result);
  })
}) 

app.post('/vipSelectCourse', function (req, res,next) {
  const vip_name = req.body.vip_name;
  console.log(vip_name);
  Vipconnection.query(`SELECT lession_id,lession_name,lession_score,teacher_name from lession  NATURAL JOIN teacher where lession_id not in ( SELECT lession_id from vip_course where vip_name = ? ) `,[vip_name], (err, Result) => {
    if (err) throw err
    /* result=JSON.stringify(Result); */
    res.send(Result);
  })
}) 
app.post('/vipDeleteCourse', function (req, res,next) {
  const number = req.body.number;
  Vipconnection.query(`DELETE FROM vip_course WHERE number=?  `,[number], (err, Result) => {
    if (err) throw err
    /* result=JSON.stringify(Result); */
    res.send(Result);
  })
}) 
app.post("/vipAddCourse", (req,res) => {
  const vip_name = req.body.vip_name;
  const lession_id = req.body.lession_id;
  Vipconnection.query(" INSERT INTO vip_course (vip_name,lession_id) VALUES (?,?)",
  [vip_name, lession_id],
  (err, result) => {
    if(err)
    res.send({err:err})
  }
  );

})
app.post('/vipCourse', function (req, res,next) {
  const vip_name = req.body.vip_name;
  console.log("shabi+++");
  console.log(vip_name);
  Vipconnection.query(`SELECT
	vip_course.number, 
	vip_course.lession_id, 
	lession.lession_name,
  lession.lession_score
FROM
	vip_course
	INNER JOIN
	lession
	ON 
		vip_course.lession_id = lession.lession_id
		and 
		vip_name = ?`,[vip_name], (err, Result) => {
    if (err) throw err
    /* result=JSON.stringify(Result); */
    res.send(Result);
  })
}) 

/* app.get('/vip_level',function (req ,res ,next){
  Vipconnection.query('SELECT vip_level From vip_init WHERE vip_id = 1', function (err, rows ,fields){
    if(err) throw err
    result=JSON.stringify(rows);
    res.end(result);
  })
}) */
 /* app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'public','hello.html'))
  console.log("///");
})  */
app.use(express.static(path.join(__dirname,'public','hello.html')))
app.post("/",(req, res) => {
  res.send(req.body);
  console.log(req.body);
})
app.get('/abcd', function (req, res) {
  res.send('hello world!!!!!!!!!!');
  console.log("dasufhajkf");
}) 
app.post('/abcd', function (req, res) {
  res.send([111,222,333,444,555,666]);
  console.log("post");
})
app.get('/users/:userId/books/:bookId', function (req, res) {
  res.send(req.params);
  console.log('get message success');
})
app.all('/secret', function (req, res, next) {
  console.log('Accessing the secret section ...')
  next(); // pass control to the next handler
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* app.use('/', indexRouter); */
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
