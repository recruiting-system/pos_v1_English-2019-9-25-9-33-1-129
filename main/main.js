'use strict';
const constantFunc = require('../test/fixtures');

function printReceipt(){
return ;
};

function decodeTags(tags){
    return combinedItems(decodeBarcodes(tags));
}

function combinedItems(decodeBarcodes){
    let itemInfo = loadItems(decodeBarcodes);
    return decodeBarcodes.map(barcode => {
        let item = itemInfo.filter(item => item.barcode === barcode.barcode)[0];
        item.count = barcode.count;
        return item;
    });
}

function loadItems(decodeBarcodes){
    return decodeBarcodes.map(barcode => 
        constantFunc.loadAllItems().filter(items=> items.barcode === barcode.barcode)[0]
    );
}

function decodeBarcodes(tags){
    let uniqueBarcodes = [...new Set(tags)].map(value => {
        let barcode = value.split('-', 2);
        if(barcode.length === 1){
            return {
                barcode: barcode[0],
                count: tags.filter(occurence => occurence == barcode).length
            }
        }
        return {
            barcode: barcode[0],
            count: parseInt(tags.filter(occurence => occurence == barcode).length) + parseInt(barcode[1])
        }
    
    });
    return uniqueBarcodes;
}

function calculateReceipt(items){
    return [{
        receiptItems : calculateReceiptItems(items),
        total : calculateReceiptTotal(items),
        savings : calculateReceiptSavings(items)
    }];
}

function calculateReceiptSavings(items){
    return calculateReceiptItems(items).map(item => (item.count * item.price) - item.subTotal).reduce((total, item) => item + total);
}

function calculateReceiptTotal(items){
    return calculateReceiptItems(items).map(item => item.subTotal).reduce((total, item) => item + total);
}

function calculateReceiptItems(items){
    return promoteReceiptItems(items, loadAllPromotion());

}

function loadAllPromotion(){
    return constantFunc.loadPromotions()
}

function promoteReceiptItems(items, promotions){
    return items.map(item => {
        const hasPromotion = promotions[0].barcodes.filter(value => value === item.barcode)[0];
        if(hasPromotion === undefined){
            item.subTotal = item.count * item.price;
            return item;
        }
        item.subTotal = (item.count-1) * item.price;
        return item;
    })
}


module.exports = {
    decodeBarcodes:decodeBarcodes,
    loadItems:loadItems,
    combinedItems:combinedItems,
    decodeTags:decodeTags,
    loadAllPromotion:loadAllPromotion,
    promoteReceiptItems:promoteReceiptItems,
    calculateReceiptItems:calculateReceiptItems,
    calculateReceiptTotal:calculateReceiptTotal,
    calculateReceiptSavings:calculateReceiptSavings,
    calculateReceipt:calculateReceipt
}
