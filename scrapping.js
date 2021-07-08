const puppeteer = require('puppeteer');

(async () => {
    
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://www.google.com/search?q=IDH+composicao', {
        waitUntil: 'networkidle2',
    });

    const arrLinks = await page.evaluate(() => {
        
        const pageCount = 8;

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

    // iterate words and check match
    /*
    Object.keys(keywords).map((key) => {
        keywords[key];
    });
    */

    await browser.close();
})();

