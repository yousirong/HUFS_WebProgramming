/**
 * -익스프레스는 미들웨어로 구성됨
 * 요청과 응답의 중간에 위치하여 미들웨어
 * app.use(미들웨어)로 장착
 *     app.use 메서드의 인자로 들어 있는 함수가 미들웨어
 * 위에서 아래로 순서대로 실행됨.
 * 미들웨어는 req, res, next가 매개변수인 함수
 * req: 요청, res:응답 조작 가능
 * next()로 다음 미들웨어로 넘아감
 */
var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

const morgan = require('morgan')

var app = express()

// view engine setup
// app.set('port',포트)로 서버가 실행될 포트 지정
// app.get('주소',라우터)로 GET요청이 올 때 어떤 동작을 할지 지정
// app.listen('포트',콜백)으로 몇 번 포트에서 서버를 실행할지 지정
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

/**
 * const express = require('express)
 * const app =express();
 * app.set('port', process.env.PORT:: 3000);
 *
 * app.get('/', (req, res) => {
 *   res.send('Hello, Express');
 * });
 *
 * app.listen(app.get('port'),() => {
 *    console.log(app.get('port'),'번 포트에서 대기중');
 * });
 */

/** 커스텀 미들웨어 만들기
 * logger보다 위에 다음 코드를 적어준다.
 * 요청 구 개, 즉 GET /와 GET /sylesheets/style.css가 서버로 전달
 *     -각각의 요청이 모두 방금 만든 커스텀 미들웨어를 작동시켰다.
 *     -이렇게 서버가 받은 요청은 미들웨어를 타고 라우터까지 전달
 * [주의사항]
 *     -반드시 미들웨어 안에서 next()를 호출해야 다음 미들웨어로 넘어감
 *     -next()는 미들웨어 흐름을 제어하는 핵심적인 함수
 */
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(function (req, res, next) {
  console.log(req.url, "I'm middleware too!")
  next()
})
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter) // main home -> localhost:3000
app.use('/users', usersRouter) // main home -> localhost:3000/users

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
