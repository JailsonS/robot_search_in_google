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

    CSVToArray: (csvfile) => new Promise(resolve => {
        //let keys = []
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

    findWords: (arrKeys, textList) => 
    {
        let result = {};

        arrKeys.forEach((obj) => {
            const k = Object.keys(obj)[0];
            const arrValues = Object.values(obj)[0]; // []
            let kval = false;

            for(let i in arrValues) {
                const kw = arrValues[i];
                for(let x in textList) {
                    const txt = textList[x].toLowerCase();
                    //console.log(txt)
                    let rs = txt.search(kw);                    
                    if(rs != -1) {
                        kval = true; break;
                    }
                }
                if(kval == true){ 
                    break; 
                }
            }
            return result[k] = kval;
        });

        return result;
    }
}
