import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Manager, Target, Popper } from 'react-popper';
import withStyles from '@material-ui/core/styles/withStyles';
import {
  MenuItem,
  MenuList,
  ClickAwayListener,
  Paper,
  Grow,
  Hidden,
  TextField
} from '@material-ui/core';
import { Person, Notifications, Dashboard, Search } from '@material-ui/icons';
import Button from '../CustomButtons/Button';
import headerLinksStyle from '../../assets/jss/material-dashboard-pro-react/components/headerLinksStyle';
import { NavLink } from "react-router-dom";
import { logout } from "../../actions/auth";


class HeaderLinks extends React.Component {
  state = {
    notificationOpen: false,
    userOpen: false
  };

  handleClick = () => {
    this.setState({ notificationOpen: !this.state.notificationOpen });
  };

  handleUserClick = () => {
    this.setState({ userOpen: !this.state.userOpen });
  };

  handleClose = () => {
    this.setState({ notificationOpen: false });
  };

  handleUserClose = () => {
    this.setState({ userOpen: false });
  };

  handleLogout = () => {
    logout();
  }

  render() {
    const { classes } = this.props;
    const { notificationOpen, userOpen } = this.state;
    const managerClasses = classNames({ [classes.managerClasses]: true });

    return (
      <div>
        <TextField id="time" placeholder="Search" />
        <Button justIcon round color="white">
          <Search className={classes.miniIcon} />
        </Button>
        <Button
          color="transparent"
          simple
          aria-label="Dashboard"
          href="/dashboard"
          justIcon
          className={classes.buttonLink}
          muiClasses={{ label: '' }}
        >
          <Dashboard className={classNames(classes.headerLinksSvg, classes.links)} />
          <Hidden mdUp>
            <span className={classes.linkText}>Dashboard</span>
          </Hidden>
        </Button>

        <Manager className={managerClasses}>
          <Target>
            <Button
              color="transparent"
              justIcon
              aria-label="Notifications"
              aria-owns={notificationOpen ? 'menu-list' : null}
              aria-haspopup="true"
              onClick={this.handleClick}
              className={classes.buttonLink}
              muiClasses={{
                label: ''
              }}
            >
              <Notifications className={classNames(classes.headerLinksSvg, classes.links)} />
              <span className={classes.notifications}>5</span>
              <Hidden mdUp>
                <span onClick={this.handleClick} className={classes.linkText}>
                  {'Notification'}
                </span>
              </Hidden>
            </Button>
          </Target>
          <Popper
            placement="bottom-start"
            eventsEnabled={notificationOpen}
            className={classNames({ [classes.popperClose]: !notificationOpen }, classes.pooperResponsive)}
          >
            <ClickAwayListener onClickAway={this.handleClose}>
              <Grow in={notificationOpen} id="menu-list" style={{ transformOrigin: '0 0 0' }}>
                <Paper className={classes.dropdown}>
                  <MenuList role="menu">
                    <MenuItem onClick={this.handleClose} className={classes.dropdownItem}>
                      {'Mike John responded to your email'}
                    </MenuItem>
                    <MenuItem onClick={this.handleClose} className={classes.dropdownItem}>
                      {'You have 5 new tasks'}
                    </MenuItem>
                    <MenuItem onClick={this.handleClose} className={classes.dropdownItem}>
                      {"You're now friend with Andrew"}
                    </MenuItem>
                    <MenuItem onClick={this.handleClose} className={classes.dropdownItem}>
                      {'Another Notification'}
                    </MenuItem>
                    <MenuItem onClick={this.handleClose} className={classes.dropdownItem}>
                      {'Another One'}
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            </ClickAwayListener>
          </Popper>
        </Manager>
        <ClickAwayListener
          onClickAway={this.handleUserClose}
          mouseEvent="onMouseDown"
          touchEvent="onTouchEnd"
        >
          <Manager className={managerClasses}>
            <Target>
              <Button
                color="transparent"
                justIcon
                aria-label="Person"
                aria-owns={userOpen ? 'menu-list' : null}
                aria-haspopup="true"
                onClick={this.handleUserClick}
                className={classes.buttonLink}
                muiClasses={{ label: '' }}
              >
                <Person className={classNames(classes.headerLinksSvg, classes.links)} />
                <Hidden mdUp>
                  <span className={classes.linkText}>Profile</span>
                </Hidden>
              </Button>
            </Target>
            <Popper
              placement="bottom-start"
              eventsEnabled={userOpen}
              className={classNames({ [classes.popperClose]: !userOpen }, classes.pooperResponsive)}
            >
              <Grow in={userOpen} id="menu-list" style={{ transformOrigin: '0 0 0' }}>
                <Paper className={classes.dropdown}>
                  <MenuList role="menu">
                    <NavLink
                      to="/profile"
                      className={classNames(classes.itemLink, classes.userCollapseLinks)}
                    >
                      <MenuItem> {'Profile'} </MenuItem>
                    </NavLink>
                    <NavLink
                      onClick={this.handleLogout}
                      to="/login"
                      className={classNames(classes.itemLink, classes.userCollapseLinks)}
                    >
                      <MenuItem> {'Logout'} </MenuItem>
                    </NavLink>
                  </MenuList>
                </Paper>
              </Grow>
            </Popper>
          </Manager>
        </ClickAwayListener>
      </div>
    );
  }
}

HeaderLinks.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(headerLinksStyle)(HeaderLinks);
