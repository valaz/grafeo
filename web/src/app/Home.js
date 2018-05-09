import React, {Component} from 'react';
import IndicatorList from "../indicator/IndicatorList";
import {withRouter} from "react-router-dom";
import {Button, Grid, withStyles} from "material-ui";
import {demoLogin} from "../util/APIUtils";
import {ACCESS_TOKEN} from "../constants";
import LoadingIndicator from "../common/LoadingIndicator";
import ReactGA from 'react-ga';
import {FormattedMessage} from "react-intl";

const styles = theme => ({
    button: {
        margin: 0,
    },
    root: {
        padding: '16px',
        background: '#f1f1f1'
    }
});
const gridSize = {
    xs: 12,
    sm: 8,
    md: 6,
    lg: 4
};

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
        this.handleDemo = this.handleDemo.bind(this);
    }

    componentWillMount() {
        document.title = "Grafeo";
    }

    handleDemo() {

        ReactGA.event({
            category: 'User',
            action: 'Generated Demo User'
        });
        this.setState({
            isLoading: true
        });
        demoLogin()
            .then(response => {
                this.setState({
                    isLoading: false
                });
                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                this.props.onLogin();
            }).catch(error => {
            if (error.status === 401) {
                this.setState({
                    isLoading: false,
                    notification: {
                        open: true,
                        message: this.props.intl.formatMessage({id: 'login.notification.incorrect'})
                    }
                });
            } else {
                this.setState({
                    isLoading: false,
                    notification: {
                        open: true,
                        message: error.message || this.props.intl.formatMessage({id: 'notification.error'})
                    }
                });
            }
        });
    }

    render() {
        const {classes} = this.props;
        if (this.state.isLoading) {
            return (
                <div className={classes.root}>
                    <LoadingIndicator/>
                </div>)
        }
        if (this.props.isAuthenticated) {
            return <IndicatorList {...this.props}/>
        } else {
            return (
                <div style={{padding: 24, background: '#f1f1f1'}}>
                    <Grid item xs={12}>
                        <Grid container
                              justify="center"
                              direction='column'
                              spacing={16}>
                            <Grid container item spacing={0} justify="center" margin='dense'>
                                <Grid item {...gridSize}>
                                    <Button fullWidth variant="raised" size="large" color="secondary"
                                            className={classes.button}
                                            onClick={this.handleDemo}>
                                        <FormattedMessage id="common.demo"/>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            )
        }
    }
}

export default withRouter(withStyles(styles)(Home));
