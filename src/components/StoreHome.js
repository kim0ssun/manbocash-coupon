import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import StoreStatus from './StoreStatus';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { Box } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import firebase from './firebase';
import subscribe from "subscribe-event";
import * as _ from 'underscore';

const db = firebase.firestore();
const useStyles = makeStyles(theme => ({
    list: {
        background: '#f2f2f2',
        padding: '0 23px 15px',
        height: '100%'
    },
    listItem: {
        background: '#fff',
        marginBottom: '7px',
        padding: "10px 15px",
    },
    itemImage: {
        width: '70px',
        height: "auto",
        paddingLeft: "10px"
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    itemDesc: {
        paddingLeft: "15px",
    }
}));

export default ({ items, handleUser, handleItems }) => {
    let history = useHistory();
    const classes = useStyles();
    const { uid } = useParams();

    const [page, setPage] = useState(1);
    const [isBottom, setIsBottom] = useState(false);

    const [displayName, setDisplayName] = useState('');
    const [displayImage, setDisplayImage] = useState('');
    const [cash, setCash] = useState(0);

    const handleListItemClick = (event, goodsCode) => {
        console.log('goodsCode: ' + goodsCode);
        history.push(`/goods/${goodsCode}`);
    }

    // 스크롤 핸들링.
    const scrollHandler = _.throttle(() => {
        let { innerHeight } = window;
        let { scrollHeight } = document.body;
        // IE에서는 document.documentElement 를 사용.
        let scrollTop =
            (document.documentElement && document.documentElement.scrollTop) ||
            document.body.scrollTop;
        // 스크롤시, 브라우저의 가장 밑에서 페이지수 증가.

        if (innerHeight + scrollTop === scrollHeight && isBottom === false) {

            setPage(prev => prev + 1);
            setIsBottom(true);

        }
    }, 300);

    useEffect(() => {
        const unsubscribe = subscribe(window, "scroll", scrollHandler);
        return () => {
            unsubscribe();
        };
    }, []);

    // 페이징 처리
    useEffect(() => {
        const tmpItems = [];
        db.collection('productsByOne').orderBy('realPrice').limit(10 * page).get()
            .then(snapshot => {
                snapshot.forEach(el => {
                    tmpItems.push(el.data());
                });
                handleItems(tmpItems);
                setIsBottom(false);

            });
    }, [page]);

    useEffect(() => {
        db.collection('members').doc(uid)
            .onSnapshot(doc => {
                setDisplayImage(doc.data().photoUrl);
                setDisplayName(doc.data().nickName);
                setCash(Number(doc.data().cash));
                handleUser({
                    'uid': uid,
                    'displayImage': doc.data().photoUrl,
                    'displayName': doc.data().nickName,
                    'cash': Number(doc.data().cash),
                });
            })

        // 뒤로가기를 눌러 돌아왔을 때 예전 위치로 찾아가려는 로직을 넣어야..(미해결)
        window.scrollTo(0, 0);
    }, []);

    return (
        <Fragment>
            <StoreStatus displayImage={displayImage} displayName={displayName} cash={cash} />
            <List className={classes.list} component="nav">
                {
                    items.map(({ goodsImgS, goodsCode, goodsName, brandName, realPrice }) => {
                        return (
                            <ListItem className={classes.listItem}
                                button
                                onClick={event => handleListItemClick(event, goodsCode)}
                                key={goodsCode}
                            >
                                <ListItemAvatar >
                                    <Avatar src={goodsImgS}
                                        className={classes.large}
                                        variant="square"
                                        alt={goodsCode}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    className={classes.itemDesc}
                                    primary={goodsName}
                                    secondary={
                                        <Fragment >
                                            <Box className={classes.itemDesc}>
                                                <Box fontSize={14} height={14}>{brandName}</Box>
                                                <Box fontSize={16} height={14} color={'#72B4B4'} textAlign="right"
                                                >{realPrice}캐시</Box>
                                            </Box>
                                        </Fragment>
                                    } />
                            </ListItem>
                        )
                    })
                }
            </List>
        </Fragment>
    );
}



