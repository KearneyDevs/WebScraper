const puppeteer = require('puppeteer');
const $ = require('cheerio');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');

const url = "https://direct.asda.com/george/home/living-room/gold-metal-trim-drinks-trolley/050125939,default,pd.html";

async function setupBrowser(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}

async function checkforPrice(page) {
    
    await page.reload();
    let html = await page.evaluate(() => document.body.innerHTML);

        $('.add-to-bag', html).each(function() {
            let addToBag = $(this).text();
           
                console.log(addToBag); 
                sendNotification(addToBag);
        })

        $('.out-of-stock', html).each(function() {
            let oos = $(this).text();
           
                console.log(oos); 
        })
    
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
          user: 'email account the notification will send from',
          pass: ''
        }
      });
    
      let textToSend = 'Now Available';
      let htmlText = `<a href=\"${url}\">Link</a>`;
    
      let info = await transporter.sendMail({
        from: '"Price Tracker" <from email>',
        to: "",
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


