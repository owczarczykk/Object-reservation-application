import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import MenuIcon from '@material-ui/icons/Menu';
import {
  AppBar,
  IconButton,
  Typography,
  Toolbar,
  Button
} from '@material-ui/core';

import { MENU_ROUTES } from '../../../constansts/routes/routes';
import * as authActions from '../../../store/actions/index';

import makeStyles from './HeaderStyles';

const Header = (props) => {
  const classes = makeStyles();
  const dispatch = useDispatch();

  let logoutBtn = null;
  if (props.isLoggedIn) {
    logoutBtn = (
      <Button
        color="inherit"
        className={classes.loginButton}
        component={Link}
        to={MENU_ROUTES.LOGIN}
        style={{ fontFamily: 'Segoe UI' }}
        onClick={() => dispatch(authActions.auth())}
      >
        Wyloguj
      </Button>
    );
  }

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          edge="start"
          onClick={props.open}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap style={{ fontFamily: 'Segoe UI' }}>
          DevTeam
        </Typography>
        {logoutBtn}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
