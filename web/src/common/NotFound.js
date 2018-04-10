import React, {Component} from 'react';
import './NotFound.css';
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

class NotFound extends Component {

    componentDidMount() {
        document.title = "404";
    }

    render() {
        const {classes} = this.props;
        return (
            <div className="page-not-found">
                <h1 className="title">
                    404
                </h1>
                <div className="desc">
                    {this.props.intl.formatMessage({id: 'error.notFound'})}
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

export default injectIntl(withStyles(styles)(NotFound));