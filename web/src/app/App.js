import React from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import {getCurrentUser} from '../util/APIUtils';
import {ACCESS_TOKEN} from '../constants';
import LoadingIndicator from "../common/LoadingIndicator";
import Login from "../user/login/Login";
import Signup from "../user/signup/Signup";
import NotFound from "../common/NotFound";
import Profile from "../user/profile/Profile";
import IndicatorConfig from "../indicator/IndicatorConfig";
import PrivateRoute from "../common/PrivateRoute";
import IndicatorPage from "../indicator/IndicatorPage";
import Home from "./Home";
import {injectIntl} from "react-intl";
import ButtonAppBar from "../common/ButtonAppBar";
import Notification from "../common/Notification";
import {withStyles} from "material-ui";
import ReactGA from 'react-ga';

const styles = theme => ({
    root: {
        flexGrow: 1,
        minWidth: 300
    },
    content: {
        flexGrow: 1,
        marginTop: theme.spacing.unit * 3,
        backgroundColor: '#f1f1f1',
    },
    bigAvatar: {
        width: 120,
        height: 120,
        fontSize: 50
    },
});

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isAuthenticated: false,
            isLoading: false,
            notification: {
                open: false,
                message: ''
            },
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
        this.handleProfileEdit = this.handleProfileEdit.bind(this);
        this.clearNotification = this.clearNotification.bind(this);
    }

    loadCurrentUser() {
        this.setState({
            isLoading: true
        });
        getCurrentUser()
            .then(response => {
                ReactGA.set({userId: response.username});
                this.setState({
                    currentUser: response,
                    isAuthenticated: true,
                    isLoading: false
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            });
        });
    }

    componentWillMount() {
        this.loadCurrentUser();
    }

    handleLogout(redirectTo = "/", notificationType = "success", description = this.props.intl.formatMessage({id: 'notification.logout'})) {
        localStorage.removeItem(ACCESS_TOKEN);

        ReactGA.set({userId: null});

        this.setState({
            currentUser: null,
            isAuthenticated: false
        });

        this.props.history.push(redirectTo);

        this.setState({
            notification: {
                open: true,
                message: description
            }
        });
    }

    handleLogin() {
        this.setState({
            notification: {
                open: true,
                message: this.props.intl.formatMessage({id: 'notification.login'})
            }
        });
        this.loadCurrentUser();
        ReactGA.event({
            category: 'User',
            action: 'User login'
        });
        this.props.history.push("/");
    }

    handleProfileEdit() {
        this.loadCurrentUser();
    }

    handleSignup() {
        this.setState({
            notification: {
                open: true,
                message: this.props.intl.formatMessage({id: 'signup.notification.success'})
            }
        });
        ReactGA.event({
            category: 'User',
            action: 'User signup'
        });
        this.props.history.push("/login");
    }

    clearNotification() {
        this.setState({
            notification: {
                open: false,
                message: ''
            }
        });
    }

    notification() {
        let {notification} = this.state;
        return (
            <Notification open={notification.open} message={notification.message}
                          cleanup={this.clearNotification}/>
        )
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                {this.notification()}
                {this.state.isLoading ?
                    (<div>
                        <LoadingIndicator/>
                    </div>) :

                    (<div className={classes.root}>
                        <ButtonAppBar isAuthenticated={this.state.isAuthenticated}
                                      currentUser={this.state.currentUser}
                                      onLogout={this.handleLogout}/>
                        <div className={classes.content}>
                                <Switch>
                                    <Route exact path="/"
                                           render={(props) => <Home isAuthenticated={this.state.isAuthenticated}
                                                                    currentUser={this.state.currentUser}
                                                                    handleLogout={this.handleLogout} {...props} />}>
                                    </Route>
                                    <Route exact path="/login"
                                           render={(props) => <Login onLogin={this.handleLogin}
                                                                     isAuthenticated={this.state.isAuthenticated}
                                                                     currentUser={this.state.currentUser}/>}/>
                                    <Route exact path="/signup"
                                           render={(props) => <Signup onSignup={this.handleSignup}/>}/>
                                    <Route exact path="/profile"
                                           render={(props) => <Profile isAuthenticated={this.state.isAuthenticated}
                                                                       currentUser={this.state.currentUser} {...props}  />}>
                                    </Route>
                                    <PrivateRoute exact authenticated={this.state.isAuthenticated} path="/profile/edit"
                                                  onEdit={this.handleProfileEdit}
                                                  component={Signup} handleLogout={this.handleLogout}
                                                  currentUser={this.state.currentUser}/>
                                    <PrivateRoute authenticated={this.state.isAuthenticated} path="/indicator/new"
                                                  component={IndicatorConfig} handleLogout={this.handleLogout}/>
                                    <PrivateRoute authenticated={this.state.isAuthenticated} path="/indicator/:id/edit"
                                                  component={IndicatorConfig} handleLogout={this.handleLogout}
                                                  isAuthenticated={this.state.isAuthenticated}/>
                                    <PrivateRoute authenticated={this.state.isAuthenticated} path="/indicator/:id"
                                                  component={IndicatorPage} handleLogout={this.handleLogout}
                                                  isAuthenticated={this.state.isAuthenticated}/>
                                    <Route component={NotFound}/>
                                </Switch>
                            </div>
                    </div>)
                }
            </div>
        );
    }
}

export default injectIntl(withRouter(withStyles(styles)(App)));