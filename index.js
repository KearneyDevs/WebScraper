const puppeteer = require('puppeteer');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
const dotenv = require('dotenv'); //required for environment variables - NOTE you need a .env file saved in directory with key value pairs e.g. EMAIL_ADDRESS=stevenwalker@test.com

const url = "https://direct.asda.com/george/home/living-room/gold-metal-trim-drinks-trolley/050125939,default,pd.html";

async function setupBrowser(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}

async function checkforPrice(page) {
    var today = new Date();
    await page.reload();

    try {
      await page.waitForSelector('.out-of-stock')

        console.log(today + ": Out of stock")
    } catch (error) {
        //console.log("Steven the error was " + error )
        console.log(today + ": In stock ")
        sendNotification();
    }
}

async function beginTracking() {
    const page = await setupBrowser();

    let job = new CronJob('*/30 * * * * *', function(){
        checkforPrice(page);
    }, null, true, null, null, true);
    job.start();
}

async function sendNotification(price) {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      let textToSend = 'Now Available';
      let htmlText = `<a href=\"${url}\">Link</a>`;

      let info = await transporter.sendMail({
        from: `"Price Tracker" <${process.env.EMAIL_ADDRESS}>`,
        to: process.env.EMAIL_ADDRESS,
        subject: 'Now Available to Buy',
        text: textToSend,
        html: htmlText
      });

      console.log("Message sent: %s", info.messageId);
    }

beginTracking();

// async function monitor(){
//     let page = await setupBrowser();
//     await checkforPrice(page);
// }

// monitor();
