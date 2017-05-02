var path = require('path');
var fs = require('fs');

//https://www.npmjs.com/package/excel-as-json
convertExcel = require('excel-as-json').processFile;

const sheetMap = [
  { sheet: 4,
    outName: "ARAnalytix"
  },
  { sheet: 3,
    outName: "Contract"
  },
  { sheet: 2,
    outName: "AdvertisingAnalytix"
  },
  { sheet: 1,
    outName: "SalesFlash"
  }
]

let src = path.join(__dirname, 'analytixfields.xlsx');
let outData = [];
let dstArray = [];
sheetMap.forEach(sheet => {
  let dst = path.join(__dirname, `${sheet.outName}.json`);
  let currSheet = sheet.sheet;
  dstArray.push(dst);
  convertExcel(src, dst, {sheet: currSheet}, (err, data) => {
    if (err) {
      console.log('error:', err);
    }
   console.log((data));
    outData.push([...data]);
    console.log(JSON.parse(data));
  });
});
console.log(outData);
fs.writeFile(path.join(__dirname, 'analytixfields.json'), JSON.stringify(outData), 'utf8', function(err) {
    if (err) {
		return console.log(err);
    } else {
		return console.log(`Finished writing file`);
    }
});

console.log('Done Exporting JSON From Excel');

let combineJSON = (jsonFiles) => {
	let finalJSON = []
	jsonFiles.forEach(aFile => {
		fs.readFile(aFile, (err,data) => {
			if (err) {
				console.error(`Error reading ${aFile} with error ${err}`);
				return
			}
			let jsonData = JSON.parse(data);
			finalJSON.push([...data]);
		});
	})
}