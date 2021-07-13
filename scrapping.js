const puppeteer = require('puppeteer');
const aux = require('./scrapping_aux');
    
(async () => {
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let keywords = [];

    page.setDefaultNavigationTimeout(0);

    await page.goto('https://www.google.com/search?q=IDH+indicadores', {
        waitUntil: 'networkidle2',
    });

    const arrLinks = await aux.getLinks(page);
    const allText = await aux.getText(browser, arrLinks);

    // csv2Array
    await aux.CSVToArray('indicators.csv')
        .then((res) => keywords = res);

    const result = aux.findWords(keywords, allText);

    let resultToArr = Object.entries(result)
    resultToArr = resultToArr.filter(([key, value]) => value > 0);
    resultToArr = Object.fromEntries(resultToArr)

    console.log(resultToArr);

    await browser.close();
})();

