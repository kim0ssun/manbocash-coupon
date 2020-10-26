import React, { useState, useEffect, Fragment } from 'react';
import firebase from './firebase';
import { BrowserRouter as Router, Route, Switch, useParams } from 'react-router-dom';
import StoreHome from './StoreHome';
import NotFound from './NotFound';
import ProductDetail from './ProductDetail';
import ProductSale from './ProductSale';
import './App.css';

const db = firebase.firestore();
export const UserContext = React.createContext();

function App() {

  const [items, setItems] = useState([]);
  const [isLoad, setLoad] = useState(false);

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

  // 처음에 한 번 기본 데이터(10개) 불러오기 + 스크롤이벤트 처리
  useEffect(() => {
    first().then(res => {
      console.log('기본 데이타 셋업');
    }).catch(err => console.log("err", err));
  }, []);

  function first() {
    const items = [];
    var first = db.collection('productsByOne').orderBy('realPrice').limit(10);
    return first.get().then(snapshot => {

      snapshot.forEach(el => {
        items.push(el.data());
      })
      setItems(items);
      setLoad(true);
    });
  }

  return (
    <UserContext.Provider value={user}>
      <Fragment>
        {!isLoad ? <div>Loading...</div> :

          <Router>
            <Switch>
              <Route exact path="/:uid" render={() => <StoreHome items={items} handleUser={handleUser} handleItems={handleItems} />} />
              <Route path="/goods/sale/:goods_code" render={() => <ProductSale user={user} items={items} />} />
              <Route path="/goods/:goods_code" render={() => <ProductDetail user={user} items={items} />} />
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Router>}
      </Fragment>
    </UserContext.Provider>
  );
}

export default App;
