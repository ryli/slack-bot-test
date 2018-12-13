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
  }

  if (payload.event) {
	  if (payload.event.type === "app_mention") {
	    if (payload.event.text.includes("tell me a joke")) {
	      // Make call to chat.postMessage using bot's token
	      responseText = joke
	      postMsg(responseText)
	    }
	  } else if (payload.event.type === "message") {
	    if (payload.event.text.includes("123")) {
	      responseText = "A bot user";
	    } else if (payload.event.text.includes("Bot user who?")) {
	      responseText = "No, I'm a bot user. I don't understand jokes.";
	    }
	console.log(responseText, payload)
	    if (responseText !== undefined) {
	      // Make call to chat.postMessage sending response_text using bot's token
	      postMsg(responseText)
	    }
	  }
  
  } else if (payload.response_url) {
    responseCommand(payload.response_url)
  }

  // ctx.response.type = 'json'
  ctx.body = responseText || ''
  next()
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)

function postMsg(msg) {
  console.log('post ', msg)
  const token = 'xoxp-492044269362-491875545588-502088043334-2ee05825b6e12bfc05dbb5ecaf173c05'
  request.post('https://slack.com/api/chat.postMessage', {
    headers : { Authorization: `Bearer ${token}` },
    formData: {
      text: msg,
      channel: 'eshop' 
    }
  }, function(err, res, body) {
     console.log(err, body)
  })
}

function responseCommand(url){
  const opt = {
    body: {
      text: 'now xx',
      attachments: [{ text: 'xxx' }]
    },
    json: true,
  }
  
  request.post(url, opt, function(err, res, body){
    console.log(err, body)
  })

}
