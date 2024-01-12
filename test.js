import "dotenv/config"
import {Telegraf} from "telegraf";

const bot = new Telegraf(process.env['TELEGRAM_TOKEN']||"");

setInterval(async () =>{
    try{
        await bot.telegram.sendMessage(5775490577, "hello")
            .then(() => console.log("Сообщение отправлено"))
            // .catch(err => console.log("Отлов ошибки2",err))
    }catch (e) {
        console.log("Отлов ошибки",e)
    }
}, 1000)


bot.start((ctx) =>{
    ctx.reply("Hello")
    console.log(ctx.from)
})


bot.launch().then()
