const firebase = require('firebase');
const admin = require('firebase-admin');
const list = require('../goods.json');
const fs = require('fs');
const { data } = require('./products338.json');// 338개 상품코드 ["","","",...]
const uploadProducts = require('./uploadProducts.json');

const { from } = require('rxjs');
const { map, distinct, toArray, scan } = require('rxjs/operators');

const config = {
    apiKey: "AIzaSyBbYjZBfxOBX2ay6jTpN9dCw0PXJ4e1rQ4",
    authDomain: "manbocash-7aa7e.firebaseapp.com",
    databaseURL: "https://manbocash-7aa7e.firebaseio.com",
    projectId: "manbocash-7aa7e",
    storageBucket: "manbocash-7aa7e.appspot.com",
    messagingSenderId: "387864702922",
    appId: "1:387864702922:web:04ab97e7a54b1807"
};
firebase.initializeApp(config);

const db = firebase.firestore();

/*-----------------------------------------------*/
/*                  상품데이터 변환                  */
/*-----------------------------------------------*/
/*
fs.readFile(__dirname + "/products338.csv", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    const draft = data.replace(/,/gi,"").split('\r\n');

    const result = {
        length: draft.length,
        data: draft
    };
    fs.writeFile(__dirname+'/products338.json', JSON.stringify(result), () => {
        console.log('Done!!');
    })

})
*/



/*-----------------------------------------------*/
/*                                               */
/*-----------------------------------------------*/
/*
const products = list.result.goodsList;
const productsSize = products.length;
let brandsNumber;
let brands;

from(products).pipe(
    map(({ brandCode, brandName }) => brandCode),
    distinct(),
    toArray()
).subscribe(x => {
    brands = x;
    brandsNumber = x.length;
});

var data = brands;
fs.writeFile('brands.txt', data, 'utf8', function (error, data) {
    if (error) { throw error };
    console.log("ASync Write Complete");
});
*/
/*
const productsByBrand = products.reduce((acc, cur) => {
    const key = cur.brandCode + "/" + cur.brandName;
    let value = [];
    if (!acc[key]) {
        value.push(cur)
    } else {
        acc[key].push(cur);
        value = acc[key];
    }
    acc = { ...acc, [key]: value };
    return acc;
}, {});


let testValue = productsByBrand[`BR00204/LTE 데이터쿠폰B2B`];
db.collection('productsByBrand').doc().set({
    brandName: `BR00204/LTE 데이터쿠폰B2B`.split('/')[1],
    brandCode: `BR00204/LTE 데이터쿠폰B2B`.split('/')[0],
    products: testValue
})
    .then((res) => {
        console.log('ok', res);
    })
    .catch(err => console.log('err: ', err));


let cnt = 0;
brands.forEach(brand => {

    db.collection('productsByBrand').doc().set({
        brandName: brand.split('/')[1],
        brandCode: brand.split('/')[0],
        products: productsByBrand[brand]
    })
        .then((res) => {
            console.log('ok', res);
        })
        .catch(err => console.log('err: ', err))

});
*/
/*
db.collection('productsByBrand')
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach(product => {
            console.log('-------------------------------');
            console.log("product => ", product.data());
        })
    })
    .catch(err => console.log('err: ', err))
*/


/* -------------------------------------------- */
/*       전체 데이타에서 data 품목번호로 필터링         */
/* -------------------------------------------- */
/*
const products = list.result.goodsList;// 형식 -> [ {},{},... ]
const filteredProducts = products
    .filter(product => {
        const res =  data
            .filter(goodsCode => product.goodsCode === goodsCode);
        if(res[0]){
            return true;
        }else {
            return false;
        }
            
    })
fs.writeFileSync(__dirname+'/uploadProducts.json', JSON.stringify({
    length: filteredProducts.length,
    data: filteredProducts
}));
*/
/* ---------------------------------------------------------- */
/*                선택 품목 모두 1 다큐먼트로 업로드                  */
/* ---------------------------------------------------------- */
/*db.collection('uploadProducts').doc().set(uploadProducts)
    .then((res) => {
        console.log('done!!!!', res);
    })
    .catch(err => console.log('err : ', err));
*/  
/* ---------------------------------------------------------- */
/*                상품 1품목당 1개 다큐먼트로 업로드                  */
/* ---------------------------------------------------------- */
let count = 0;
uploadProducts.data.forEach(product => {
    db.collection('productsByOne').doc().set(product)
        .then(res => {
            console.log(`${++count} 번째 상품 업로드`);
        })
        .catch(err => console.log('error: ',err));
})
console.log('Done~~~~~');
