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
let promiseArray = [];

sheetMap.forEach(sheet => {
  let dst = path.join(__dirname, `${sheet.outName}.json`);
  let currSheet = sheet.sheet;
  dstArray.push(dst);
  let newPromise = new Promise((resolve, reject) => { 
	  	convertExcel(src, dst, {sheet: currSheet}, (err, data) => {
		    if (err) {
		      console.log('error:', err);
		    }
		    outData.push([...data]);
		    resolve(data);
	  });
  	})
  promiseArray.push(newPromise);
}); //End forEach

Promise.all(promiseArray)
	.then(values => {
		//values will be an array of arrays of objects
		let newVals = [];
		//Looping through each top level array which hold the actual array of objects
		values.forEach(obj => {
			//Looping through actual array of objects and pushing to a new single array
			obj.forEach(subObj => {
				newVals.push(subObj)
			});
		});

		writeData(newVals, path.join(__dirname, 'analytixfields.json'))
	});

// fs.writeFile(path.join(__dirname, 'analytixfields.json'), JSON.stringify(outData), 'utf8', function(err) {
//     if (err) {
// 		return console.log(err);
//     } else {
// 		return console.log(`Finished writing file`);
//     }
// });

console.log('Done Exporting JSON From Excel');

let writeData = (data, dstFile) => {
	fs.writeFile(dstFile, JSON.stringify(data), 'utf8', function(err) {
    if (err) {
		return console.log(err);
    } else {
		return console.log(`Finished writing ${dstFile}`);
    }
});
}