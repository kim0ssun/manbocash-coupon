import React, { useState, useEffect, Fragment } from 'react';
import firebase from './firebase';
import { BrowserRouter as Router, Route, Switch, useParams } from 'react-router-dom';
import StoreHome from './StoreHome';
import NotFound from './NotFound';
import ProductDetail from './ProductDetail';
import ProductSale from './ProductSale';
import CouponBox from './CouponBox';
import './App.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import products from './uploadProducts.json';

const db = firebase.firestore();

export const UserContext = React.createContext();

function App() {

  const totalItems = products.data;//초기 값
  const keys = [];
  const  brandsImg = totalItems
    .reduce((acc, cur) => {
    if (keys.indexOf(cur['brandName']) === -1) {

      keys.push(cur['brandName']);
      const tmpObj = {};
      tmpObj.brandName = cur['brandName'];
      tmpObj.brandIconImg = cur['brandIconImg'];
    
      acc.push(tmpObj);
    }
    return acc;
  }, []);
  console.log(brandsImg);
  const [items, setItems] = useState([]);
  const [isLoad, setLoad] = useState(false);
  const [isRequest, setIsRequest] = useState(false);
  const [brand, setBrand] = useState('GS25');

  const [user, setUser] = useState({});

  // handle user 데이터
  const handleUser = ({ uid, displayName, displayImage, cash }) => {
    const user = { uid, displayName, displayImage, cash };
    setUser(user);
  }

  // handle items 데이터
  const handleItems = (items) => {
    setItems(items);
  }

  const handleRequest = (isRequest) => {
    setIsRequest(isRequest);
  }

  const handleBrand = (brand) => {
    setBrand(brand);
  }

  //초기 데이터 확보
  useEffect(() => {


    console.log('version: ', localStorage.getItem('version'));
    console.log('data :', localStorage.getItem('data'));

    let oldVersion = 0;
   
    if(!localStorage.getItem('version')) {
      localStorage.setItem('version', 0);
      localStorage.setItem('data', JSON.stringify(totalItems));
    } else {
      oldVersion = Number(localStorage.getItem('version'));     
    }
    console.log('oldVersion: ',oldVersion);
    // 현재 저장데이터(모바일쿠폰) 버전이 최신인지 확인...
    // 먼저 현재 버전 확인
    db.collection('uploadProducts').get()
      .then( snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.data());
          // 최신버전이 아니면 최신버전 다운
          if(doc.data().version > oldVersion) {
            //setItems(doc.data);
            console.log('doc.version > oldVersion');
            console.log('db:', doc.data().data);

            localStorage.setItem('version', doc.data().version);
            localStorage.setItem('data', JSON.stringify(doc.data().data));
            setItems(doc.data().data);
            setLoad(true);
          } else {
            console.log(doc.data().version);
            console.log('local: ',localStorage.getItem('data'));
            const tmpItems =  JSON.parse(localStorage.getItem('data'));
            setItems(tmpItems);
            setLoad(true);
          }
        });
      })
      .catch(err => {
        console.log(err);
      })

  }, []);


  return (
    <UserContext.Provider value={user}>
      <Fragment>
        {!isLoad ? <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100vh',
        }} >
          <CircularProgress />
        </div> :

          <Router>
            <Switch>
              <Route exact path="/:uid" render={() => <StoreHome brand={brand} handleBrand={handleBrand} isRequest={isRequest} handleRequest={handleRequest} totalItems={totalItems} items={items} brandsImg={brandsImg} handleUser={handleUser} handleItems={handleItems} />} />
              <Route exact path="/goods/sale/:goods_code" render={() => <ProductSale items={items} />} />
              <Route exact path="/goods/:goods_code" render={() => <ProductDetail items={items} />} />
              <Route exact path="/api/couponbox" render={() => <CouponBox />} />
              <Route exact path="/">
                <NotFound />
              </Route>
            </Switch>
          </Router>}
      </Fragment>
    </UserContext.Provider>
  );
}

export default App;
