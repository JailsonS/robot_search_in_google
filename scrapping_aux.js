const csv = require('csv-parser');
const fs = require('fs');

module.exports = {

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

    findWords: (arrKeys, textList) => {
        // pecorrer cada keyword
        // iterar em cada array de keyword

        arrKeys.forEach((obj) => {

            let k = Object.keys(obj)[0];
            let arrValues = Object.values(obj);


    
        });


        // return {indicator: true}

    }
}
