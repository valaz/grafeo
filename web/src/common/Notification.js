import React from 'react';
import {IconButton, Snackbar} from "material-ui";
import {Close} from '@material-ui/icons'


class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            message: ''
        }
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.open !== nextProps.open || this.props.message !== nextProps.message) {
            this.setState({
                open: nextProps.open,
                message: nextProps.message
            })
        }
    }

    handleClick = () => {
        this.setState({open: true});
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            open: false,
            message: ''
        });

        this.props.cleanup();
    };

    render() {
        return <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={this.state.open}
            autoHideDuration={3000}
            onClose={this.handleClose}
            SnackbarContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{this.state.message}</span>}
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    onClick={this.handleClose}
                >
                    <Close/>
                </IconButton>,
            ]}
        />;
    }
}

export default Notification;