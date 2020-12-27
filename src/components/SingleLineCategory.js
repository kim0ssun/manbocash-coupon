import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import FreeBreakfastIcon from '@material-ui/icons/FreeBreakfast';
import tileData from './tileData';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',

    },
    title: {
        color: theme.palette.primary.light,
        textAlign: 'center',
    },
    titleBar: {
        height: '20px',
        paddingTop: '20px'
    },
    tile: {
        paddingBottom: '20px',
    }
}));

export default function SingleLineGridList() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <GridList className={classes.gridList} cols={4.5} cellHeight={80} >
                {tileData.map((tile) => (

                    <GridListTile key={tile.img} className={classes.tile}>
                        <ButtonBase style={{height: '100px !important'}}>
                            <img src={tile.img} alt={tile.title} />
                        </ButtonBase>
                    </GridListTile>

                ))}
            </GridList>
        </div>
    );
}