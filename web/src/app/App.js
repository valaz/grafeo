import React from 'react';
import './App.css';
import {Route, Switch, withRouter} from 'react-router-dom';
import {getCurrentUser} from '../util/APIUtils';
import {ACCESS_TOKEN} from '../constants';
import AppHeader from "../common/AppHeader";
import {Layout, notification} from 'antd';
import LoadingIndicator from "../common/LoadingIndicator";
import Login from "../user/login/Login";
import Signup from "../user/signup/Signup";
import NotFound from "../common/NotFound";
import Profile from "../user/profile/Profile";
import NewIndicator from "../indicator/NewIndicator";
import EditIndicator from "../indicator/EditIndicator";
import PrivateRoute from "../common/PrivateRoute";
import IndicatorPage from "../indicator/IndicatorPage";
import Home from "./Home";
import {injectIntl} from "react-intl";

const {Content} = Layout;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isAuthenticated: false,
            isLoading: false
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.handleLogin = this.handleLogin.bind(this);

        notification.config({
            placement: 'topRight',
            top: 70,
            duration: 2,
        });
    }

    loadCurrentUser() {
        this.setState({
            isLoading: true
        });
        getCurrentUser()
            .then(response => {
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

        this.setState({
            currentUser: null,
            isAuthenticated: false
        });

        this.props.history.push(redirectTo);

        notification[notificationType]({
            message: 'Progressio',
            description: description
        });
    }

    handleLogin() {
        notification.success({
            message: 'Progressio',
            description: this.props.intl.formatMessage({id: 'login.notification.success'})
        });
        this.loadCurrentUser();
        this.props.history.push("/");
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator/>
        }
        return (
            <Layout className="app-container">
                <AppHeader isAuthenticated={this.state.isAuthenticated}
                           currentUser={this.state.currentUser}
                           onLogout={this.handleLogout}/>

                <Content className="app-content">
                    <div className="container">
                        <Switch>
                            <Route exact path="/"
                                   render={(props) => <Home isAuthenticated={this.state.isAuthenticated}
                                                            currentUser={this.state.currentUser}
                                                            handleLogout={this.handleLogout} {...props} />}>
                            </Route>
                            <Route path="/login"
                                   render={(props) => <Login onLogin={this.handleLogin}
                                                             isAuthenticated={this.state.isAuthenticated}
                                                             currentUser={this.state.currentUser}/>}/>
                            <Route path="/signup" component={Signup}/>
                            <Route path="/users/:username"
                                   render={(props) => <Profile isAuthenticated={this.state.isAuthenticated}
                                                               currentUser={this.state.currentUser} {...props}  />}>
                            </Route>
                            <PrivateRoute authenticated={this.state.isAuthenticated} path="/indicator/new"
                                          component={NewIndicator} handleLogout={this.handleLogout}/>
                            <PrivateRoute authenticated={this.state.isAuthenticated} path="/indicator/edit/:id"
                                          component={EditIndicator} handleLogout={this.handleLogout}
                                          isAuthenticated={this.state.isAuthenticated}/>
                            <PrivateRoute authenticated={this.state.isAuthenticated} path="/indicator/:id"
                                          component={IndicatorPage} handleLogout={this.handleLogout}
                                          isAuthenticated={this.state.isAuthenticated}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default injectIntl(withRouter(App));