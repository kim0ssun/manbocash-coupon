import React, { Fragment, useState, useEffect, useContext } from 'react';
import StoreStatus from './StoreStatus';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import { UserContext } from './App';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles(theme => ({
    root: {

    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
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
        backgroundColor: "#72B4B4",
        height: "50px",
        textAlign: "center",
        color: "white",
        lineHeight: "50px",
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
    const [category1Seq, setCategory1Seq] = useState(1);
    const classes = useStyles();
    const [open, setOpen] = useState(false);

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
                setCategory1Seq(item.category1Seq);
                setLoad(true);
            });

        window.scrollTo(0, 0)

    }, []);

    const handleBuyClick = (event) => {
        if (user.cash >= realPrice) {
            history.push(`/goods/sale/${goodsCode}`);
        } else {
            // 다이어로그 메세지
            setOpen(true);
        }
    };

    const handleClose = () => setOpen(false);

    return (

        <Fragment>
            <StoreStatus
                displayImage={user.displayImage}
                displayName={user.displayName}
                cash={user.cash}
                uid={user.uid}
            />
            <Box pb={4} >
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
                    onClick={(event) => handleBuyClick(event)}
                >
                    구매하기
                    </Box>

            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title"></DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        캐시잔액이 부족하여 구매하실 수 없습니다.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        확인
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}
