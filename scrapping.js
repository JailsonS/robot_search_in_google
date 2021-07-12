const puppeteer = require('puppeteer');
const aux = require('./scrapping_aux');
    
(async () => {
    
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    let keywords = [];

    await page.goto('https://www.google.com/search?q=IDH+composicao', {
        waitUntil: 'networkidle2',
    });

    const arrLinks = await aux.getLinks(page);
    const textList = await aux.getText(browser, arrLinks);

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
