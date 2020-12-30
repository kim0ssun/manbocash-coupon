import React, { useState, useEffect, Fragment, useContext } from 'react';
import axios from 'axios';
import qs from 'qs';
import { makeStyles } from '@material-ui/core/styles';
import StoreStatus from './StoreStatus';
import Box from '@material-ui/core/Box';
import { useHistory, useParams } from 'react-router-dom';
import { USER_ID, AUTH_CODE, AUTH_TOKEN } from '../config';
import firebase from './firebase';
import { UserContext } from './App';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'absolute',
        top: '60px',
        bottom: '0',
        left: '0',
        right: '0',
        padding: '15px',
    },
    imgDiv: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // height: '90vh',
        // width: '90vw',
    },
    media: {
        backgroundSize: '100% auto !important',
        backgroundPosition: 'center bottom !important',
        height: 250,
        maxWidth: '100%'
    },
    noCoupons: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0
    }
}));

const db = firebase.firestore();

export default () => {
    let history = useHistory();
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [modalImg, setModalImg] = useState(null);
    const user = useContext(UserContext);

    const [coupons, setCoupons] = useState([]);

    // 초기 쿠폰함 정보 업데이트
    useEffect(() => {
        const updateCouponInfo = () => {
            console.log('fetchCouponInfo');
            db.collection(`members/${user.uid}/coupons`).orderBy('validPrdEndDt', 'desc').get()
                .then(querySnapshot => {
                    const temp = [];
                    querySnapshot.forEach(async doc => {
                        let response = await axios({
                            url: '/bizApi/coupons/',
                            method: 'post',
                            headers: { 'content-type': 'application/x-www-form-urlencoded' },
                            data: qs.stringify({
                                api_code: '0201',
                                custom_auth_token: AUTH_TOKEN,
                                custom_auth_code: AUTH_CODE,
                                dev_yn: 'N',
                                tr_id: doc.id,
                            })
                        });
                        let data = response.data.result;
                        console.log('coupon data: ');
                        console.log(data[0].resCode);
                        console.log(data[0].couponInfoList[0]);
                        db.collection(`members/${user.uid}/coupons`).doc(doc.id)
                            .set(data[0].couponInfoList[0], { merge: true })
                            .then(() => {
                                temp.push({
                                    ...data[0].couponInfoList[0],
                                    couponImgUrl: doc.data().couponImgUrl,
                                });
                            });

                    });
                    console.log(temp);
                    setCoupons(temp);
                })
                .then(() => {
                    localStorage.setItem('couponAdded', 'false');
                });
        };

        const fetchCoupons = () => {
            console.log('fetchCoupons');
            db.collection(`members/${user.uid}/coupons`).get()
                .then(querySnapshot => {
                    const temp = [];
                    querySnapshot.forEach(doc => {
                        temp.push(doc.data());
                    });
                    console.log(temp);
                    setCoupons(temp);
                })
                .catch((err) => {
                    console.log(err);
                })
        };

        if (localStorage.getItem('couponAdded') && localStorage.getItem('couponAdded') === 'true') {
            updateCouponInfo();
        } else {
            fetchCoupons();
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
    }

    const handleClick = (couponImgUrl) => {
        setModalImg(couponImgUrl);
        setOpen(true);
    };

    return (
        <Fragment>
            <StoreStatus displayImage={user.displayImage} displayName={user.displayName} cash={user.cash} uid={user.uid} />
            { coupons.length === 0 ?
                <Box className={classes.noCoupons}>
                    <Typography >
                        쿠폰이 없습니다.
                    </Typography>
                </Box>
                :
                <Grid className={classes.root} container spacing={3}>
                    {coupons.map(coupon => {

                        const remainingDates = (dateString) => {
                            const year = dateString.substring(0, 4);
                            const month = dateString.substring(4, 6);
                            const date = dateString.substring(6, 8);
                            const hour = dateString.substring(8, 10);
                            const min = dateString.substring(10, 12);
                            const sec = dateString.substring(12, 14);
                            const validDate = new Date(`${year}-${month}-${date} ${hour}:${min}:${sec}`).getTime();
                            const today = new Date().getTime();

                            return Math.floor((validDate - today) / 24 / 60 / 60 / 1000);
                        };

                        const contentText = () => {
                            switch (coupon.pinStatusCd) {
                                case '01':
                                    return `유효기간 ${remainingDates(coupon.validPrdEndDt)}일 남았음`;
                                    break;
                                case '02':
                                    return '사용완료';
                                    break;
                                case '08':
                                    return '유효기간 만료';
                                    break;
                                default:
                                    break;
                            }
                        };


                        return (
                            <Grid item xs={6}>
                                <Card onClick={coupon.pinStatusCd === '01' ? () => handleClick(coupon.couponImgUrl) : ''}>
                                    <CardMedia
                                        className={classes.media}
                                        image={coupon.couponImgUrl}
                                        title=""
                                    />
                                    <CardContent >
                                        <Typography align="center">
                                            {contentText()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })}
                    <Modal
                        open={open}
                        onClose={handleClose}
                        className={classes.imgDiv}
                        style={{ width: '100vw', height: '100vh', padding: '0px' }}
                    >

                        <img src={modalImg} alt={''} style={{ width: '90vw', height: '90vh' }} />

                    </Modal>
                </Grid>

            }
        </Fragment>

    );
}