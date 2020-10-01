import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import StoreStatus from './StoreStatus';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { Box } from '@material-ui/core';
import { useHistory } from 'react-router-dom';


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

export default ({items}) => {
    let history = useHistory();
    const classes = useStyles();
      
    const handleListItemClick = (event, goodsCode) => {
        console.log('goodsCode: '+goodsCode);
        history.push(`/goods/${goodsCode}`);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Fragment>
            <StoreStatus displayImage={"http://k.kakaocdn.net/dn/Mwvp3/btqy5S8Fpd7/quc7e5AgtoNAIHpaJUBLKK/profile_640x640s.jpg"} displayName={"yskim"} cash={5000} />
            <List className={classes.list} component="nav">
                {
                    items.map(({ goodsImgS, goodsCode, goodsName, brandName, realPrice }) => {
                        return (
                            <ListItem className={classes.listItem} 
                                button 
                                onClick={event => handleListItemClick(event, goodsCode)}    
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
                                        <Fragment className={classes.itemDesc}>
                                            <Box fontSize={14} height={14}>{brandName}</Box>
                                            <Box fontSize={16} height={14} color={'#72B4B4'} textAlign="right"
                                            >{realPrice}캐시</Box>
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



