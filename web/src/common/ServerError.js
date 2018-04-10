import React, {Component} from 'react';
import './ServerError.css';
import {Link} from 'react-router-dom';
import {Button, withStyles} from "material-ui";
import {injectIntl} from "react-intl";

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    link: {
        textDecoration: 'none'
    }
});

class ServerError extends Component {


    componentDidMount() {
        document.title = "500";
    }

    render() {
        const {classes} = this.props;
        return (
            <div className="server-error-page">
                <h1 className="server-error-title">
                    500
                </h1>
                <div className="server-error-desc">
                    {this.props.intl.formatMessage({id: 'error.serverError'})}
                </div>
                <Link to="/" className={classes.link}>
                    <Button variant="raised" className={classes.button}>
                        {this.props.intl.formatMessage({id: 'error.goBack'})}
                    </Button>
                </Link>
            </div>
        );
    }
}

export default injectIntl(withStyles(styles)(ServerError));