const puppeteer = require('puppeteer');
const toArray = require('./scrapping_aux');
    
(async () => {
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let keywords = [];

    await page.goto('https://www.google.com/search?q=IDH+composicao', {
        waitUntil: 'networkidle2',
    });

    const arrLinks = await page.evaluate(() => {
        
        const pageCount = 3;

        let arrLinks = [];
        for(let i = 0; i < pageCount; i++) {
            let link = document.querySelectorAll('#rso a')[i].getAttribute('href');
            let isHttp = link.startsWith('http://');
            let isHttps = link.startsWith('https://');

            if(isHttp || isHttps) {
                arrLinks.push(link);
            } 
        }
        return arrLinks;
    });

    // get texts to be evaluated
    let textList = [];
    for(let l in arrLinks) {
        let nPage = await browser.newPage();

        await nPage.goto(arrLinks[l], {
            waitUntil: 'networkidle2',
        });

        const arrText = await nPage.evaluate(() => {

            let c = document.querySelectorAll('p').length;

            let groupText = [];
            for(let i=1; i < c; i++) {
                let txt = document.querySelectorAll('p')[i].textContent;
                groupText.push(txt);
            }
            return groupText;
        });

        textList.push(...arrText);
    }

    // csv2Array
    await toArray.CSVToArray('indicators.csv')
        .then((res) => keywords = res);

    console.log(keywords);
    

    await browser.close();
})();
