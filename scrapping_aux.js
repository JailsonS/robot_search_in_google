const csv = require('csv-parser');
const fs = require('fs');

module.exports = {

    getLinks: (page) => {

        const arrLinks = page.evaluate(() => {
        
            const pageCount = 10;
    
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

        return arrLinks;
            
    },

    getText: async (browser, arrLinks) => {
        let allText = '';
        for(let l in arrLinks) {
            let nPage = await browser.newPage();
            
            nPage.setDefaultNavigationTimeout(0);
            
            await nPage.goto(arrLinks[l], {
                waitUntil: 'networkidle2',
            });

            const arrText = await nPage.evaluate(() => {
                let c = document.querySelectorAll('p').length;

                let groupText = '';
                for(let i=1; i < c; i++) {
                    let txt = document.querySelectorAll('p')[i].textContent.replace(/\s+/g, ' ').trim();
                    groupText = groupText.concat('' + txt);
                }
                return groupText;
            });

            allText = allText.concat(arrText);
        }
        
        return allText;
    },

    CSVToArray: (csvfile) => new Promise(resolve => {
        let list = []
        fs.createReadStream(csvfile).pipe(csv({ separator:';', headers:false }))
            .on('data', (data) => {

                let obj = {}
                let k = data[0].toUpperCase();
                let v = data[1].toLowerCase().split(', ');
                
                obj[k] = v

                list.push(obj);

            })
            .on('end', () => {
                resolve(list)
            })
    }),

    findWords: (arrKeys, allText) => 
    {
        let result = {};

        arrKeys.forEach((obj) => {
            const k = Object.keys(obj)[0];
            const arrValues = Object.values(obj)[0]; // []
            let kval = 0;
            let kCount = 0;

            for(let i in arrValues) {
                const kw = arrValues[i];
                const regex = new RegExp( kw, 'gi' );
                const founded = allText.match(regex);

                if(founded != null) {
                    kCount = kCount + founded.length;
                }                
            }

            return result[k] = kCount;
        });

        return result;
    }
}







