const puppeteer = require('puppeteer');
const aux = require('./scrapping_aux');
    
(async () => {
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let keywords = [];

    await page.goto('https://www.google.com/search?q=IDH+composicao', {
        waitUntil: 'networkidle2',
    });

    const arrLinks = await aux.getLinks(page);

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
    await aux.CSVToArray('indicators.csv')
        .then((res) => keywords = res);

    const result = aux.findWords(keywords, textList);

    let resultToArr = Object.entries(result)
    resultToArr = resultToArr.filter(([key, value]) => value == true);
    resultToArr = Object.fromEntries(resultToArr)

    console.log(resultToArr);

    await browser.close();
})();
