import React, { Fragment, useState, useEffect } from 'react';
import StoreStatus from './StoreStatus';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import { useParams } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
    medium: {
        width: theme.spacing(20),
        height: theme.spacing(20),
    },
    small: {
        width: theme.spacing(4),
        height: theme.spacing(4),
        paddingLeft: '10px'
    },
    divider: {
        height: '6px',
        backgroundColor: '#f2f2f2'
    }
}));


export default ({ items }) => {
    const classes = useStyles();
    let { goods_code } = useParams();
    const [item, setItem] = useState({});

    useEffect(() => {
        items
            .filter(item => item.goodsCode === goods_code)
            .forEach(item => {
                const tmpItem = {
                    goodsName: item.goodsName,
                    brandName: item.brandName,
                    realPrice: item.realPrice,
                    goodsImgS: item.goodsImgS,
                    brandIconImg: item.brandIconImg
                };
                setItem(tmpItem);
            });
        window.scrollTo(0, 0);
    }, []);
    return (
        <Fragment>
            <Box>
                <StoreStatus displayImage={"http://k.kakaocdn.net/dn/Mwvp3/btqy5S8Fpd7/quc7e5AgtoNAIHpaJUBLKK/profile_640x640s.jpg"} displayName={"yskim"} cash={5000} />
                <Box>
                    <Box height={""} display="flex" alignItems="center">
                        <Box px={4} px={2}>
                            <Avatar src={item.goodsImgS} className={classes.medium} variant="square" />
                        </Box>
                        <Box pr={4}>
                            <Box>{item.goodsName}</Box>
                            <Box display="flex" alignItems="center">
                                <Box color="gray" fontSize={14}>{item.brandName}</Box>
                                <Avatar src={item.brandIconImg} className={classes.small} />
                            </Box>
                            <Box color="#72B4B4">{item.realPrice}캐시</Box>
                        </Box>
                    </Box>
                    <Divider className={classes.divider} />
                    <Box py={3}>
                        <Box display="flex" px={4} py={0} justifyContent="space-between">
                            <Box>총 보유 캐시</Box>
                            <Box>5000캐시</Box>
                        </Box>
                        <Box display="flex" display="flex" px={4} py={0} justifyContent="space-between">
                            <Box>구매 캐시</Box>
                            <Box>{item.realPrice}캐시</Box>
                        </Box>
                    </Box>
                    <Divider className={classes.divider} />
                    <Box display="flex" py={3} px={4} justifyContent="space-between">
                        <Box>캐시 잔액</Box>
                        <Box color="#72B4B4">{5000 - parseInt(item.realPrice)}캐시</Box>
                    </Box>
                    <Divider className={classes.divider} />
                    <Box py={5}>
                        <Box textAlign="center" lineHeight="25px">
                            구매완료 버튼을 누른 후, <br />
                            <span style={{ color: '#72B4B4' }}>내 쿠폰함</span>으로 이동하니<br />
                        그곳에서 원하는 상품바코드를 이용해<br />
                        구매하시면 됩니다.<br />
                        </Box>
                        <Box textAlign="center" pt={5} pb={2} style={{ textDecoration: 'underline' }}><a>취소하기</a></Box>
                    </Box>
                    <Box textAlign="center" bgcolor="#72B4B4" py={2} color="white">구매완료</Box>
                </Box>
            </Box>
        </Fragment>
    )
}
