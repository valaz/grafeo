import React, {Component} from "react";
import {Button, withStyles} from '@material-ui/core';
import {FormattedMessage, injectIntl} from "react-intl";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faFacebookF} from "@fortawesome/free-brands-svg-icons"

const styles = theme => ({
    fbButton: {
        color: theme.palette.getContrastText('#4267b2'),
        backgroundColor: '#3b5998',
        '&:hover': {
            backgroundColor: '#4267b2',
        },
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
});

class FBLoginButton extends Component {

    render() {
        const {classes} = this.props;

        return <Button fullWidth variant="contained" className={classes.fbButton} size="large"
                       onClick={this.props.onClick}>
            <FontAwesomeIcon icon={faFacebookF} className={classes.leftIcon}/>
            <FormattedMessage id="login.form.facebook"/>
        </Button>
    }
}


export default injectIntl(withStyles(styles)(FBLoginButton));