'use strict';


function printReceipt(){
return 'asdsadagfdhfgdh';
};

function decodeBarcodes(tags){
    let uniqueBarcodes = [...new Set(tags.map(barCode => barCode))];
    console.log('uniqueBarcodes: ' + uniqueBarcodes);
};

module.exports = {
    decodeBarcodes : decodeBarcodes

}
