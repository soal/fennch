const Koa = require("koa");
const app = new Koa();

const slowRes = (timeout = 5000) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({ type: 1, msg: "Sooooooo sloooooow..." });
  }, timeout);
})

app.use(async ctx => {
  console.log('REQUEST')
  console.log('REQUEST URL: ', ctx.request.url)
  switch (ctx.request.url) {
    case "/fast":
      ctx.body = { type: 0, msg: "Fast response" };
      break

    case "/slow":
      ctx.body = await slowRes(5000);
      break

    case "/post":
      console.log(ctx.request.method);
      if (ctx.request.method === 'POST') {
        ctx.body = { type: 1, msg: "Posted hello world" };
      }
      break

    case "/wrongdata":
      ctx.body = { errors: [{ name: 'error1' }] };
      ctx.status = 422;
      break

    default:
      ctx.status = 404;
      // ctx.body = { msg: "Hello World" };
      break
  }
});

app.listen(3333);
