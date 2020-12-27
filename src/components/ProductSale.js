import React, { Fragment, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import qs from 'qs';
import StoreStatus from './StoreStatus';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import { useParams, Link, useHistory } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import { UserContext } from './App';
import { USER_ID, AUTH_CODE, AUTH_TOKEN } from '../config';
import firebase from './firebase';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

const db = firebase.firestore();
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
    let history = useHistory();
    const classes = useStyles();
    let { goods_code } = useParams();
    const [item, setItem] = useState({});
    const [buttonClicked, setButtonClicked] = useState(false);

    const user = useContext(UserContext);

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

    // TR_ID생성: service_20201220_12345678
    const genTrid = () => {
        const today = new Date();
        const fullYear = today.getFullYear();
        const month = today.getMonth() + 1;
        const date = today.getDate();
        return `service_${fullYear}${month}${date}_${Math.round(Math.random() * 100000000)}`;
    }

    //구매완료버튼 클릭시
    const handlePurchase = async () => {
        if(buttonClicked) return;
        const trId = genTrid();
        setButtonClicked(true);
        //쿠폰발송 요청
        let response = await axios({
            url: '/bizApi/send/',
            method: 'post',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify({
                api_code: '0204',
                custom_auth_token: AUTH_TOKEN,
                custom_auth_code: AUTH_CODE,
                dev_yn: 'N',
                goods_code: `${goods_code}`,
                mms_msg: `mms메세지`,
                mms_title: `mms타이틀`,
                callback_no: `01072122774`,
                phone_no: `01072122774`,
                tr_id: trId,
                user_id: USER_ID,
                gubun: 'I',
            })
        });
        let data = response.data.result;
        /*
            code    4  결과코드 (코드목록 참조)
            message 50 결과메시지 (코드목록 참조)
            pinNo   20 쿠폰번호 (gubun‘Y’ 입력 표시)
            orderNo 20 주문번호

            {
                “code”: “0000”,
                “message”: null, 
                “result”: {
                    “code”: “0000”, 
                    “message”: null, 
                    “result”: {
                        “orderNo”: “20190812000000”,
                        “pinNo”: “900343630367”,
                        "couponImgUrl": "http://t.giftishow.co.kr/mms_90012345678_01.jpg"
                    } 
                }
            }
        */
        console.log(data);
        //console.log(genTrid());
        //요청 결과가 정상인 경우 DB에 받은 정보 저장
        if (data.code === '0000') {

            localStorage.setItem('couponAdded', 'true');
            const resultData = data.result;
            console.log('tr_id: ', trId);
            db.collection(`members/${user.uid}/coupons`).doc(trId)
                .set({
                    ...resultData, 
                    trId: trId, 
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(), 
                })
                .then(function () {
                    console.log('DB저장 석세스...');
                    // cash update
                    db.collection('members').doc(user.uid)
                        .update({cash: user.cash - item.realPrice});
                    // home으로 이동
                    history.push(`/${user.uid}`);
                })
                .catch(function () {
                    console.log('DB저장 실패스...');
                })
        } else {
            //요청 결과가 오류인 경우 오류 결과에 따라 재요청 혹은 취소한 후 메세지 표시
            alert('쿠폰발송 요청에 성공하지 못했습니다!');
            setButtonClicked(false);
        }


    }

    //구매취소 버튼 클릭시
    const handleCancel = () => {
        history.push(`/${user.uid}`);
    }
    return (
        <Fragment>
            <Box>
                <StoreStatus displayImage={user.displayImage} displayName={user.displayName} cash={user.cash} />
                <Box>
                    <Box height={""} display="flex" alignItems="center">
                        <Box px={4}>
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
                            <Box>{user.cash}캐시</Box>
                        </Box>
                        <Box display="flex" px={4} py={0} justifyContent="space-between">
                            <Box>구매 캐시</Box>
                            <Box>{item.realPrice}캐시</Box>
                        </Box>
                    </Box>
                    <Divider className={classes.divider} />
                    <Box display="flex" py={3} px={4} justifyContent="space-between">
                        <Box>캐시 잔액</Box>
                        <Box color="#72B4B4">{user.cash - parseInt(item.realPrice)}캐시</Box>
                    </Box>
                    <Divider className={classes.divider} />
                    <Box py={5}>
                        <Box textAlign="center" lineHeight="25px">
                            구매완료 버튼을 누른 후, <br />
                            <span style={{ color: '#72B4B4' }}><Link to="/api/couponbox">내 쿠폰함</Link></span>으로 이동하니<br />
                        그곳에서 원하는 상품바코드를 이용해<br />
                        구매하시면 됩니다.<br />
                        </Box>
                        <Box textAlign="center" pt={5} pb={2} style={{ textDecoration: 'underline' }} onClick={handleCancel} disabled={true}><a>취소하기</a></Box>
                    </Box>
                    <Box textAlign="center" bgcolor="#72B4B4" py={2} color="white" onClick={handlePurchase} disabled={buttonClicked}>구매완료</Box>
                </Box>
            </Box>
        </Fragment>
    )
}
