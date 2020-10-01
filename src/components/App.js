import React, { useState, useEffect, Fragment } from 'react';
import firebase from './firebase';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import StoreHome from './StoreHome';
import NotFound from './NotFound';
import ProductDetail from './ProductDetail';
import ProductSale from './ProductSale';
import './App.css';
import subscribe from "subscribe-event";
import * as _ from 'underscore';

const db = firebase.firestore();

function App() {

  const [items, setItems] = useState([]);
  const [isLoad, setLoad] = useState(false);
  const [page, setPage] = useState(1);
  const [isBottom, setIsBottom] = useState(false);

  // 스크롤 핸들링.
  const  scrollHandler = _.throttle(() => {
    const { innerHeight } = window;
    const { scrollHeight } = document.body;
    // IE에서는 document.documentElement 를 사용.
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    // 스크롤링 했을때, 브라우저의 가장 밑에서 200정도 높이가 남았을때에 실행하기위함.
    console.log('throttle', scrollHeight - innerHeight - scrollTop);
    console.log('isBottom : ',isBottom);
    if (scrollHeight - innerHeight - scrollTop < 200) {
      if (isBottom) {
        return;
      } else {
        setIsBottom(true);
        
        console.log("Almost Bottom Of This Browser", page);
      }
    }
  }, 300);

  // 기본 데이터 불러오기
  useEffect(() => {
    first().then(res => {
      console.log('기본 데이타 셋업');
    }).catch(err => console.log("err", err));
  }, []);

  function first(){
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

  // 스크롤 이벤트 처리
  useEffect(() => {
    const unsubscribe = subscribe(window, "scroll", scrollHandler);
    return () => {
      unsubscribe();
    };
  }, []);

  // 페이징 처리
  useEffect(() => {
    const tmpItems = [];
    console.log('페이징: ',page,isBottom);
    
    db.collection('productsByOne').orderBy('realPrice').limit(10*page).get()
      .then(snapshot => {
        snapshot.forEach(el => {
          tmpItems.push(el.data());
        });
        setItems(tmpItems);
        setIsBottom(false);
      });
  }, [page]);

  return (
    <Fragment>
      {!isLoad ? <div></div> :

        <Router>
          <Switch>
            <Route exact path="/" render={() => <StoreHome items={items} />} />
            <Route exact path="/goods/:goods_code" render={() => <ProductDetail items={items} />} />
            <Route exact path="/goods/sale/:goods_code" render={() => <ProductSale items={items} />} />
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </Router>}
    </Fragment>
  );
}

export default App;
