import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Card, {CardHeader} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import {Delete, Edit, ExpandMore, MoreVert} from "@material-ui/icons";
import {Button, CardActions, CardContent, Collapse, ListItemIcon, ListItemText, Menu, MenuItem} from "material-ui";
import {withRouter} from "react-router-dom";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    withMobileDialog,
} from 'material-ui/Dialog';
import {injectIntl} from "react-intl";
import classnames from 'classnames';

const styles = theme => ({
    card: {},
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    menuItem: {},
    primary: {},
    icon: {},
});

class IndicatorCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            open: false,
            expanded: false,
        };
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.handleMenuEdit = this.handleMenuEdit.bind(this);
        this.handleMenuDelete = this.handleMenuDelete.bind(this);
        this.handleDialogDelete = this.handleDialogDelete.bind(this);
        this.handleExpandClick = this.handleExpandClick.bind(this);
    }

    componentWillMount() {
        let tableExpanded = localStorage.getItem('indicator_' + this.props.indicator.id + '_table_expanded');
        if (tableExpanded) {
            let isExpanded = (tableExpanded === 'true');
            this.setState({
                expanded: isExpanded
            })
        }
    }

    handleMenuClick(event) {
        this.setState({
            anchorEl: event.currentTarget
        });
    };

    handleMenuClose() {
        this.setState({
            anchorEl: null
        });
    };

    handleDialogClose() {
        this.setState({
            open: false
        });
    };

    handleMenuEdit() {
        this.setState({
            anchorEl: null
        });
        this.props.history.push(this.props.location.pathname + "/edit")
    };

    handleMenuDelete() {
        this.setState({
            anchorEl: null,
            open: true

        });
    };

    handleDialogDelete() {
        this.setState({
            open: false
        });
        this.props.handleDelete(this.props.indicator.id);
    };

    handleExpandClick = () => {
        let expanded = this.state.expanded;
        this.setState({expanded: !expanded});
        localStorage.setItem('indicator_' + this.props.indicator.id + '_table_expanded', (!expanded).toString());
    };

    render() {
        const {classes} = this.props;
        const {anchorEl} = this.state;
        const {fullScreen} = this.props;

        return (
            <div>
                <Card className={classes.card}>
                    <CardHeader
                        action={
                            <IconButton
                                aria-owns={anchorEl ? 'simple-menu' : null}
                                aria-haspopup="true"
                                onClick={this.handleMenuClick}>
                                <MoreVert/>
                            </IconButton>

                        }
                        title={this.props.indicator.name}
                    />
                    <CardContent>
                        {this.props.chart}
                        {this.props.form}
                    </CardContent>

                    <CardActions className={classes.actions} disableActionSpacing>
                        <IconButton
                            className={classnames(classes.expand, {
                                [classes.expandOpen]: this.state.expanded,
                            })}
                            onClick={this.handleExpandClick}
                            aria-expanded={this.state.expanded}
                            aria-label="Show more"
                        >
                            <ExpandMore/>
                        </IconButton>
                    </CardActions>
                    <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            {this.props.table}
                        </CardContent>
                    </Collapse>
                </Card>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleMenuClose}
                >
                    <MenuItem className={classes.menuItem} onClick={this.handleMenuEdit}>
                        <ListItemIcon className={classes.icon}>
                            <Edit/>
                        </ListItemIcon>
                        <ListItemText classes={{primary: classes.primary}} inset
                                      primary={this.props.intl.formatMessage({id: 'indicator.view.card.edit.menu'})}/>
                    </MenuItem>
                    <MenuItem className={classes.menuItem} onClick={this.handleMenuDelete}>
                        <ListItemIcon className={classes.icon}>
                            <Delete/>
                        </ListItemIcon>
                        <ListItemText classes={{primary: classes.primary}} inset
                                      primary={this.props.intl.formatMessage({id: 'indicator.view.card.delete.menu'})}/>
                    </MenuItem>
                </Menu>
                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.open}
                    onClose={this.handleDialogClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                        {this.props.intl.formatMessage({id: 'indicator.view.card.delete.dialog.title'})}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.props.intl.formatMessage({id: 'indicator.view.card.delete.dialog.description'})}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogClose} color="primary">
                            {this.props.intl.formatMessage({id: 'indicator.view.card.delete.dialog.cancel'})}
                        </Button>
                        <Button onClick={this.handleDialogDelete} color="primary" autoFocus>
                            {this.props.intl.formatMessage({id: 'indicator.view.card.delete.dialog.delete'})}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

IndicatorCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(injectIntl(withStyles(styles)(withMobileDialog()(IndicatorCard))));