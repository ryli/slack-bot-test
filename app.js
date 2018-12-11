const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const baselogger = require('koa-base-logger')
const request = require('request')

const app = new Koa()
const router = new Router()

app.use(bodyParser())

app.use(baselogger({
  appName: 'slack-bot',
  fileName: 'slack-bot',
  useKoa: true,
  recordBody: true,
}))

router.get('/', (ctx, next) => {
  ctx.body = 'hello'
  next()
})

router.post('/', (ctx, next) => {
  const payload = ctx.request.body
  console.log('body: ', payload)
  let responseText 

  if (payload.type === "url_verification") {
    responseText = `challenge=${payload.challenge}`
  } else if (payload.event.type === "app_mention") {
    if (payload.event.text.includes("tell me a joke")) {
      // Make call to chat.postMessage using bot's token
      postMsg('joke')
    }
  } else if (payload.event.type === "message") {
    if (payload.event.text.includes("Who's there?")) {
      responseText = "A bot user";
    } else if (payload.event.text.includes("Bot user who?")) {
      responseText = "No, I'm a bot user. I don't understand jokes.";
    }

    if (responseText !== undefined) {
      // Make call to chat.postMessage sending response_text using bot's token
      postMsg(responseText)
    }
  }

  // ctx.response.type = 'json'
  ctx.body = responseText
  next()
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)

function postMsg(msg, opt) {
  request.post(`https://slack.com/api/chat.postMessage`, {
	  headers : { Authorization: 'Bearer xoxp-492044269362-491875545588-500459323636-c6ab8fe331c1279b34f99e8a7997057a'},
    formData: {
      text: msg,
      channel: 'eshop' 
    }
  })
}
