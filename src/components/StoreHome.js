import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import StoreStatus from './StoreStatus';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { Box, Divider } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import firebase from './firebase';
import subscribe from "subscribe-event";
import * as _ from 'underscore';
import SingleLineCategory from './SingleLineCategory';
import SearchBar from "material-ui-search-bar";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { IndeterminateCheckBox } from '@material-ui/icons';
import Paper from '@material-ui/core/Paper'

const db = firebase.firestore();
const useStyles = makeStyles(theme => ({
    list: {
        background: '#f2f2f2',
        padding: '8px 23px 15px',
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
    },
    brands: {
        padding: '5px 10px',
        background: '#eaeaea',
    },
    tile: {
        
        '&:hover ': {
            cursor: 'pointer',
            border: '1px solid #ccc',
        },
        padding: '10px',
    },
    active: {
        border: '2px solid red',
    },
    search: {
        padding: '0 20px',
        borderRadius: '10px'
    }
}))

export default ({ totalItems, brand, isRequest, items, brandsImg, handleBrand, handleRequest, handleUser, handleItems }) => {
    let history = useHistory();
    const classes = useStyles();
    const { uid } = useParams();

    const [displayName, setDisplayName] = useState('');
    const [displayImage, setDisplayImage] = useState('');
    const [cash, setCash] = useState(0);

    const [searchText, setSearchText] = useState('');

    const handleListItemClick = (event, goodsCode) => {
        console.log('goodsCode: ' + goodsCode);
        history.push(`/goods/${goodsCode}`);
    }

    useEffect(() => {
        
        //handleItems(totalItems);
        db.collection('members').doc(uid)
            .onSnapshot(doc => {
                setDisplayImage(doc.data().photourl);
                setDisplayName(doc.data().nickname);
                setCash(Number(doc.data().cash || 0));
                let user = {
                    'uid': uid,
                    'displayImage': doc.data().photourl,
                    'displayName': doc.data().nickname,
                    'cash': Number(doc.data().cash || 0),
                };
                console.log('user: ' + JSON.stringify(user));
                handleUser(user);
            })

        // 뒤로가기를 눌러 돌아왔을 때 예전 위치로 찾아가려는 로직을 넣어야..(미해결)
        window.scrollTo(0, 0);
       
    }, []);

    const handleClickBrand = ({ brandName }) => {
        handleItems(totalItems);
        handleRequest(false);
        handleBrand(brandName);
    };

    const handleRequestSearch = () => {
        //서치텍스트를 포함한 상품을 전부 찾는다
        console.log('handleRequestSearch');
        console.log(searchText);
        console.log(totalItems);
        console.log(totalItems[0].srchKeyword);
        console.log(totalItems.filter(item => item.srchKeyword.toLowerCase().indexOf(searchText.toLowerCase()) > 0));
        const filteredItems = totalItems.filter(item => item.srchKeyword.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
        handleRequest(true);
        handleItems(filteredItems);
    };

    return (
        <Fragment>
            <StoreStatus displayImage={displayImage} displayName={displayName} cash={cash} uid={uid}/>

            <SearchBar
                placeholder="검색"
                value={searchText}
                onChange={(newValue) => setSearchText(newValue)}
                onRequestSearch={handleRequestSearch}
            />

            <GridList cellHeight={70} cols={6} spacing={5} className={classes.brands}>
                {brandsImg
                    .map(item => {
                        return (
                            <GridListTile className={classes.tile} onClick={() => handleClickBrand(item)}>
                                <img src={item.brandIconImg} alt={item.brandName} />
                            </GridListTile>
                        )
                    })}
            </GridList>
            <List className={classes.list} component="nav">
                {
                    items
                        .filter(item => {
                            if (isRequest) {
                                return true
                            } else {
                                return item.brandName === brand
                            };
                        })
                        .map(({ goodsImgS, goodsCode, goodsName, brandName, realPrice, category1Seq, category2Seq }) => {
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
                                                    <Box fontSize={14} height={14}>{brandName}({category1Seq}/{category2Seq})</Box>
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



