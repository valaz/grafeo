import React, {Component} from 'react';
import {getUserProfile} from '../../util/APIUtils';
import {Avatar, Col, Row, Tabs} from 'antd';
import {getRandomColor} from '../../util/Colors';
import LoadingIndicator from '../../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import IndicatorList from "../../indicator/IndicatorList";

import {FormattedDate, FormattedMessage, injectIntl} from 'react-intl';

const TabPane = Tabs.TabPane;

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false
        };
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }

    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });

        getUserProfile(username)
            .then(response => {
                this.setState({
                    user: response,
                    isLoading: false
                });
                document.title = this.state.user.name;
            }).catch(error => {
            if (error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }

    componentDidMount() {
        const username = this.props.match.params.username;
        this.loadUserProfile(username);
        document.title = this.props.intl.formatMessage({id: 'profile.title'});
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator/>;
        }

        if (this.state.notFound) {
            return <NotFound/>;
        }

        if (this.state.serverError) {
            return <ServerError/>;
        }

        const tabBarStyle = {
            textAlign: 'center'
        };

        return (
            <div>
                {
                    this.state.user ? (
                        <Row className="user-details">
                            <Col xs={24} sm={8} md={9} className="user-avatar">
                                <Avatar className="user-avatar-circle"
                                        style={{backgroundColor: getRandomColor(this.state.user.name)}}>
                                    {this.state.user.name[0].toUpperCase()}
                                </Avatar>
                            </Col>
                            <Col xs={24} sm={16} md={15} className="user-summary">
                                <div className="full-name">{this.state.user.name}</div>
                                <div className="username">@{this.state.user.username}</div>
                                <div className="user-joined">
                                    <FormattedMessage id="profile.joined" values={{
                                        date: <FormattedDate
                                            value={new Date(this.state.user.joinedAt)}
                                            year='numeric'
                                            month='long'
                                            day='2-digit'
                                        />
                                    }}/>
                                </div>
                            </Col>
                            <Col xs={24}>
                                <Tabs defaultActiveKey="1"
                                      animated={false}
                                      tabBarStyle={tabBarStyle}
                                      size="large"
                                      className="profile-tabs">
                                    <TabPane tab={
                                        <span>
                                            <FormattedMessage id="profile.indicators"/>
                                        </span>}
                                             key="1">
                                        <IndicatorList isAuthenticated={this.props.isAuthenticated}
                                                       currentUser={this.props.currentUser}
                                                       type="USER_CREATED_INDICATORS"/>
                                    </TabPane>
                                    <TabPane tab={
                                        <span>
                                            <FormattedMessage id="profile.records"/>
                                        </span>} key="2">

                                    </TabPane>
                                </Tabs>
                            </Col>
                        </Row>
                    ) : null
                }
            </div>
        );
    }
}

export default injectIntl(Profile);