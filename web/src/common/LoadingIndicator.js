import React from 'react';
import {CircularProgress, withStyles} from "material-ui";

const styles = theme => ({
    progress: {
        margin: theme.spacing.unit * 2,
        display: 'block',
        textAlign: 'center',
        marginTop: 30
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    placeholder: {
        height: 40,
    },
});

class LoadingIndicator extends React.Component {
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.placeholder}>
                    <CircularProgress className={classes.progress}/>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(LoadingIndicator)