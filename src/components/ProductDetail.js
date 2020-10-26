import React, { Fragment, useState, useEffect, useContext } from 'react';
import StoreStatus from './StoreStatus';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import { UserContext } from './App';

const useStyles = makeStyles(theme => ({
    root: {

    },
    small: {
        width: theme.spacing(4),
        height: theme.spacing(4),
        paddingLeft: '10px'
    },
    large: {
        width: theme.spacing(50),
        height: theme.spacing(50),
    },
    btn_buy: {
        '&:hover': {
            cursor: 'pointer',
            background: '#175656'
        }
    }
}));

export default ({ items }) => {
    let location = useLocation();
    let { goods_code } = useParams();
    let history = useHistory();
    const [isLoad, setLoad] = useState(false);
    const [goodsImgB, setGoodsImgB] = useState("");
    const [goodsCode, setGoodsCode] = useState("");
    const [content, setContent] = useState("");
    const [realPrice, setRealPrice] = useState("");
    const [goodsName, setGoodsName] = useState("");
    const [brandName, setBrandName] = useState("");
    const [brandIconImg, setBrandIconImg] = useState("");
    const classes = useStyles();

    const user = useContext(UserContext);

    useEffect(() => {
        items
            .filter(item => item.goodsCode === goods_code)
            .forEach(item => {
                setGoodsImgB(item.goodsImgB);
                setContent(item.content);
                setGoodsCode(item.goodsCode);
                setRealPrice(item.realPrice);
                setBrandName(item.brandName);
                setBrandIconImg(item.brandIconImg);
                setGoodsName(item.goodsName);
                setLoad(true);
            });

        window.scrollTo(0, 0)

    }, []);

    const handleBuyClick = (event) => {
        history.push(`/goods/sale/${goodsCode}`);
    };

    return (

        <Fragment>
            <StoreStatus
                displayImage={user.displayImage}
                displayName={user.displayName}
                cash={user.cash}
            />
            {!isLoad ? <Box>loading....</Box> : (<Box pb={4} >
                <Box textAlign="center" p={2} m={"auto"} display="flex" justifyContent="center" alignItems="center">
                    <Avatar src={goodsImgB} className={classes.large} variant='square' />
                </Box>
                <Box textAlign="center" p={2}>
                    <Box>{goodsName}</Box>
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <Box color="gray" fontSize={14}>{brandName}</Box>
                        <Avatar src={brandIconImg} className={classes.small} />
                    </Box>
                    <Box color="#72B4B4">{realPrice}캐시</Box>
                </Box>
                <Box
                    bgcolor="#F2F2F2"
                    fontSize="12"
                    textAlign="center"
                    height="50px"
                    lineHeight="50px">상세정보({goodsCode})</Box>
                <Box px={4} py={2} fontSize="13px" >

                    {content.split('\n').map(line => {
                        return (<span>{line}<br /></span>)
                    })}

                </Box>
                <Box
                    className={classes.btn_buy}
                    bgcolor="#72B4B4"
                    height="50px"
                    textAlign="center"
                    color="white"
                    lineHeight="50px"
                    onClick={(event) => handleBuyClick(event)}
                >
                    구매하기
                </Box>
            </Box>)}
        </Fragment>
    )
}
