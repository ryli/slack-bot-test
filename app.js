const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const baselogger = require('koa-base-logger')

const app = new Koa()
const router = new Router()

app.use(bodyParser())

app.use(baselogger({
  appName: 'slack-bot',
  fileName: 'slack-bot',
  useKoa: true,
}))

router.get('/', (ctx, next) => {
  ctx.body = 'hello'
  next()
})

router.post('/', (ctx, next) => {
  const payload = ctx.request.body
  console.log('body: ', payload)
  let responseText = 'default'

  if (payload.event.type === "app_mention") {
    if (payload.event.text.includes("tell me a joke")) {
      // Make call to chat.postMessage using bot's token
    }
  } else if (payload.event.type === "message") {
    if (payload.event.text.includes("Who's there?")) {
      responseText = "A bot user";
    } else if (payload.event.text.includes("Bot user who?")) {
      responseText = "No, I'm a bot user. I don't understand jokes.";
    }

    if (responseText !== undefined) {
      // Make call to chat.postMessage sending response_text using bot's token
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
