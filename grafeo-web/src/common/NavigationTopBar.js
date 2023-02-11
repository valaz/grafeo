import React from 'react';
import PropTypes from 'prop-types';
import {
    AppBar,
    Button,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    withStyles
} from '@material-ui/core';
import {NavLink, withRouter} from "react-router-dom";
import {AccountCircle, Add, Eject, ExpandMore, Home, PermIdentity, Security} from "@material-ui/icons";
import {FormattedMessage} from "react-intl";
import settings from "../config";

const styles = theme => ({
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
    leftIcon: {
        marginRight: theme.spacing.unit/2,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit/2,
    },
});

class NavigationTopBar extends React.Component {
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
        this.handlePolicy = this.handlePolicy.bind(this);
        this.handleHome = this.handleHome.bind(this);
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

    handleHome() {
        this.props.history.push('/');
        this.handleClose();
    }

    handleProfile() {
        this.props.history.push('/profile');
        this.handleClose();
    }

    handlePolicy() {
        this.props.history.push('/policy');
        this.handleClose();
    }

    handleAddIndicator() {
        this.props.history.push('/indicators/new');
        this.handleClose();
    }

    render() {
        const {classes} = this.props;
        let profileMenu = this.getProfileMenu();
        return (
            <div className={classes.root}>
                <AppBar position="static" elevation={0}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            <NavLink to="/" style={{color: '#FFFFFF', textDecoration: 'none'}}>
                                {/*{process.env.REACT_APP_TITLE}*/}
                                {settings.TITLE}
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
        let {classes} = this.props;
        return <div>
            <IconButton
                aria-owns={open ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.handleHome}
                color="inherit"
            >
                <Home/>
            </IconButton>
            <IconButton
                aria-owns={open ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.handleAddIndicator}
                color="inherit"
            >
                <Add/>
            </IconButton>
            <Button
                aria-owns={open ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
            >
                <PermIdentity className={classes.leftIcon} />
                {this.props.currentUser.name}
                <ExpandMore className={classes.rightIcon} />
            </Button>
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
                <MenuItem onClick={this.handleProfile}>
                    <ListItemIcon>
                        <AccountCircle/>
                    </ListItemIcon>
                    <FormattedMessage id="navbar.profile"/>
                </MenuItem>
                <MenuItem onClick={this.handlePolicy}>
                    <ListItemIcon>
                        <Security/>
                    </ListItemIcon>
                    <FormattedMessage id="navbar.policy"/>
                </MenuItem>
                <MenuItem onClick={this.handleLogout}>
                    <ListItemIcon>
                        <Eject/>
                    </ListItemIcon>
                    <FormattedMessage id="navbar.logout"/>
                </MenuItem>
            </Menu>
        </div>

    }

    getUnAuthMenu() {
        return <div>
            <NavLink to="/policy" style={{color: '#FFFFFF', textDecoration: 'none'}}>
                <Button color="inherit">
                    <FormattedMessage id="navbar.policy"/></Button>
            </NavLink>
            <NavLink to="/login" style={{color: '#FFFFFF', textDecoration: 'none'}}>
                <Button color="inherit">
                    <FormattedMessage id="navbar.login"/></Button>
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

NavigationTopBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(NavigationTopBar));
