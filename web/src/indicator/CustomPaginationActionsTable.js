import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Table, {TableBody, TableCell, TableFooter, TablePagination, TableRow,} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import {Delete, Edit, KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import {injectIntl} from "react-intl";
import moment from "moment/moment";

const dateFormat = 'YYYY-MM-DD';

const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit,
    },
});

class TablePaginationActions extends React.Component {
    handleFirstPageButtonClick = event => {
        this.props.onChangePage(event, 0);
    };

    handleBackButtonClick = event => {
        this.props.onChangePage(event, this.props.page - 1);
    };

    handleNextButtonClick = event => {
        this.props.onChangePage(event, this.props.page + 1);
    };

    handleLastPageButtonClick = event => {
        this.props.onChangePage(
            event,
            Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
        );
    };

    render() {
        const {classes, count, page, rowsPerPage, theme} = this.props;

        return (
            <div className={classes.root}>
                {/*<IconButton*/}
                {/*onClick={this.handleFirstPageButtonClick}*/}
                {/*disabled={page === 0}*/}
                {/*aria-label="First Page"*/}
                {/*>*/}
                {/*{theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}*/}
                {/*</IconButton>*/}
                <IconButton
                    onClick={this.handleBackButtonClick}
                    disabled={page === 0}
                    aria-label="Previous Page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
                </IconButton>
                <IconButton
                    onClick={this.handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Next Page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
                </IconButton>
                {/*<IconButton*/}
                {/*onClick={this.handleLastPageButtonClick}*/}
                {/*disabled={page >= Math.ceil(count / rowsPerPage) - 1}*/}
                {/*aria-label="Last Page"*/}
                {/*>*/}
                {/*{theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}*/}
                {/*</IconButton>*/}
            </div>
        );
    }
}

TablePaginationActions.propTypes = {
    classes: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, {withTheme: true})(
    TablePaginationActions,
);


const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit,
    },
    table: {
        minWidth: 300,
        tableLayout: 'fixed'
    },
    tableCol: {
        width: '40%'
    },
    tableActionCol: {
        paddingLeft: 0,
        width: '10%'
    },
    action: {
        margin: 0
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    selectRoot: {
        marginRight: theme.spacing.unit,
        marginLeft: theme.spacing.unit,
        color: theme.palette.text.secondary,
    },
});

class CustomPaginationActionsTable extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: [],
            page: 0,
            rowsPerPage: 10,
        };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentWillMount() {
        let {dataSource} = this.props;
        this.updateData(dataSource);
    }

    componentWillReceiveProps(nextProps) {
        let {dataSource} = nextProps;
        this.updateData(dataSource);
    }

    updateData(dataSource) {
        let tableData = dataSource.slice(0);
        tableData = tableData.map(d => this.createRowData(d)).reverse();

        this.setState({
            data: tableData
        });

        if (tableData.length <= 5) {
            this.setState({
                rowsPerPage: 5
            });
        }
    }

    createRowData(data) {
        const {classes} = this.props;
        let editAction = <div>
            <IconButton className={classes.action} aria-label="Edit"
                        onClick={() => this.handleEdit(data)}>
                <Edit/>
            </IconButton>
        </div>;
        let deleteAction = <div>
            <IconButton className={classes.action} aria-label="Delete"
                        onClick={() => this.handleDelete(data)}>
                <Delete/>
            </IconButton>
        </div>;
        return {
            id: data.id,
            date: this.formatDate(data.date),
            value: this.formatNumber(data.value),
            editAction: editAction,
            deleteAction: deleteAction
        };
    }

    formatDate(date) {
        return moment(date, dateFormat).format('DD MMMM');
    }


    formatNumber(n) {
        // return <FormattedNumber value={n}/>;
        return this.props.intl.formatNumber(n) + ' ' + this.props.unit;
    }

    handleEdit(record) {
        this.props.editHadler(record)
    }

    handleDelete(record) {
        this.props.deleteHandler(record)
    }

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };

    render() {
        const {classes} = this.props;
        const {data, rowsPerPage, page} = this.state;
        if (data.length === 0) {
            return null;
        }

        return (
            <div className={classes.tableWrapper}>
                <Table className={classes.table}>
                    <TableBody>
                        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                            return (
                                <TableRow key={n.id}>
                                    <TableCell className={classes.tableCol}>{n.date}</TableCell>
                                    <TableCell className={classes.tableCol}>{n.value}</TableCell>
                                    <TableCell className={classes.tableActionCol}>{n.editAction}</TableCell>
                                    <TableCell className={classes.tableActionCol}>{n.deleteAction}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                classes={{selectRoot: classes.selectRoot}}
                                colSpan={3}
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                labelRowsPerPage={this.props.intl.formatMessage({id: 'indicator.view.table.rowsPerPage'})}
                                labelDisplayedRows={({from, to, count}) => from + '-' + to + ' ' + this.props.intl.formatMessage({id: 'indicator.view.table.of'}) + ' ' + count}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                Actions={TablePaginationActionsWrapped}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        );
    }
}

CustomPaginationActionsTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default injectIntl(withStyles(styles)(CustomPaginationActionsTable));