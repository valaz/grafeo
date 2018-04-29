import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import {NavLink, withRouter} from "react-router-dom";
import {AccountCircle} from "@material-ui/icons";
import {Menu, MenuItem} from "material-ui";
import {FormattedMessage} from "react-intl";

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

class ButtonAppBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.getAuthMenu = this.getAuthMenu.bind(this);
        this.getUnAuthMenu = this.getUnAuthMenu.bind(this);
        this.getProfileMenu = this.getProfileMenu.bind(this);
        this.handleMenu = this.handleMenu.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleProfile = this.handleProfile.bind(this);
        this.handleAddIndicator = this.handleAddIndicator.bind(this);
    }


    handleMenu(event) {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose() {
        this.setState({anchorEl: null});
    };

    handleLogout() {
        this.props.onLogout()
    }

    handleProfile() {
        this.props.history.push('/profile');
        this.handleClose();
    }

    handleAddIndicator() {
        this.props.history.push('/indicator/new');
        this.handleClose();
    }

    render() {
        const {classes} = this.props;
        let profileMenu = this.getProfileMenu();
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            <NavLink to="/" style={{color: '#FFFFFF', textDecoration: 'none'}}>
                                Grafeo
                            </NavLink>
                        </Typography>
                        {profileMenu}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }

    getAuthMenu() {
        const {anchorEl} = this.state;
        const open = Boolean(anchorEl);
        return <div>
            <IconButton
                aria-owns={open ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
            >
                <AccountCircle/>
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={this.handleClose}
            >
                <MenuItem onClick={this.handleAddIndicator}>
                    <FormattedMessage id="navbar.addIndicator"/></MenuItem>
                <MenuItem onClick={this.handleProfile}>
                    <FormattedMessage id="navbar.profile"/>
                </MenuItem>
                <MenuItem onClick={this.handleLogout}>
                    <FormattedMessage id="navbar.logout"/></MenuItem>
            </Menu>
        </div>

    }

    getUnAuthMenu() {
        return <div>
            <NavLink to="/login" style={{color: '#FFFFFF', textDecoration: 'none'}}>
                <Button color="inherit">
                    <FormattedMessage id="navbar.login"/></Button>
            </NavLink>
            <NavLink to="/signup" style={{color: '#FFFFFF', textDecoration: 'none'}}>
                <Button color="inherit">
                    <FormattedMessage id="navbar.signup"/></Button>
            </NavLink>
        </div>
    }

    getProfileMenu() {
        const {isAuthenticated} = this.props;
        if (isAuthenticated) {
            return this.getAuthMenu();
        } else {
            return this.getUnAuthMenu();
        }
    }
}

ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ButtonAppBar));
