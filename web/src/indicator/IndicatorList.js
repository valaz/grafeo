import React, {Component} from 'react';
import './IndicatorList.css';
import {deleteIndicator, getUserCreatedIndicators} from '../util/APIUtils';
import Indicator from './Indicator';
import LoadingIndicator from '../common/LoadingIndicator';
import {Button, Icon, Row} from 'antd';
import {INDICATOR_LIST_SIZE} from '../constants';
import {withRouter} from 'react-router-dom';

class IndicatorList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indicators: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            currentVotes: [],
            isLoading: false
        };
        this.loadIndicatorList = this.loadIndicatorList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    loadIndicatorList(page = 0, size = INDICATOR_LIST_SIZE) {
        let promise;
        if (this.props.isAuthenticated) {
            promise = getUserCreatedIndicators(this.props.currentUser.username, page, size);
        }

        if (!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                const indicators = this.state.indicators.slice();
                const currentVotes = this.state.currentVotes.slice();
                this.setState({
                    indicators: indicators.concat(response.content),
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    last: response.last,
                    currentVotes: currentVotes.concat(Array(response.content.length).fill(null)),
                    isLoading: false
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });

    }

    componentWillMount() {
        this.loadIndicatorList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
            this.resetState();
            this.loadIndicatorList();
        }
    }

    resetState() {
        this.setState({
            indicators: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            currentVotes: [],
            isLoading: false
        });
    }

    handleLoadMore() {
        this.loadIndicatorList(this.state.page + 1);
    }

    handleDelete(id) {
        let promise;
        if (this.props.isAuthenticated) {
            promise = deleteIndicator(id);
        }

        if (!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });
        promise
            .then(response => {
            }).catch(error => {
            console.log(error);
        });
        this.setState({
            isLoading: false
        });
    }

    render() {
        const indicatorViews = [];
        if (this.props.currentUser) {
            this.state.indicators.forEach((indicator) => {
                indicatorViews.push(<Indicator
                    key={indicator.id}
                    indicator={indicator}
                    handleDelete={this.handleDelete}
                />)
            });
        }

        return (
            <div className="indicators-container">
                <Row>
                    {indicatorViews}
                </Row>
                {
                    !this.state.isLoading && this.state.indicators.length === 0 ? (
                        <div className="no-indicators-found">
                            <span>No Indicators Found.</span>
                        </div>
                    ) : null
                }
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-indicators">
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus"/> Load more
                            </Button>
                        </div>) : null
                }
                {
                    this.state.isLoading ?
                        <LoadingIndicator/> : null
                }
            </div>
        );
    }
}

export default withRouter(IndicatorList);