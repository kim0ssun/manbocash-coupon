import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite'


export default function ({ displayImage, displayName, cash, uid }) {

    let history = useHistory();

    return (
        <Box
            display="flex"
            bgcolor={'#f2f2f2'}
            height="48px"
            px={3}
            py={1}
            alignItems="center"
            justifyContent="space-between"
        >
            <Box display="flex" alignItems="center">
                <Avatar src={displayImage} alt="" onClick={() => history.push(`/${uid}`)}/>
                <Box px={1}><Typography fontSize={11} >{displayName}</Typography></Box>
            </Box>
            <Link to="/api/couponbox" style={{ "textDecoration": "none" }}>
                <Box
                    fontSize={13}
                    padding={0.5}
                    width={70}
                    height={17}
                    textAlign="center" borderRadius={6} color={"#fff"} bgcolor={"#72B4B4"}>
                    내 쿠폰함
                </Box>
            </Link>
            <Box display="flex" alignItems="center">
                <Box p={1} fontSize={13}>보유캐시</Box>
                <Box display="flex"
                    borderRadius={'8px'}
                    bgcolor={"#fff"}
                    minWidth="80px"
                    height="20px"
                    justifyContent="space-between"
                    alignItems="center"
                    px={1}
                >
                    <FavoriteIcon style={{ color: '#8177E6', fontSize: '14px' }} />
                    <Box fontSize={13} color={'#72B4B4'}>{cash}</Box>
                </Box>
            </Box>
        </Box>
    )
}