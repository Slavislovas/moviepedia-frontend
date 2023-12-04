import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useUser } from '../config/UserContext';

const NavigationBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false); // State for dialog
  const { user, logout, setUser } = useUser();

  useEffect(() => {
  }, [user, setUser]);

  const handleLogoutDialogOpen = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutDialogClose = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleLogoutDialogClose();
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const renderDesktopMenu = () => (
    <>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {/* Move these buttons to the left side */}
      <Button color="inherit" key="Actors" component={Link} to="/actors">
        Actors
      </Button>
      <Button color="inherit" key="Directors" component={Link} to="/directors">
        Directors
      </Button>
      <Button color="inherit" key="Movies" component={Link} to="/movies">
        Movies
      </Button>
      {(user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_CONTENT_CURATOR') && (
        <Button color="inherit" key="ContentPanel" component={Link} to="/content-panel">
          Content Panel
        </Button>
      )}     
    </div>
    <div style={{marginLeft: 'auto'}}>
    {(user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_USER') && (
      <Button color="inherit" key="Profile" component={Link} to={`/profile/${user.userId}`}>
        Profile
      </Button>
    )}
    {user.accessToken ? (
      <Button color="inherit" key="Logout" onClick={handleLogoutDialogOpen}>
      Logout
    </Button>
    ) : (
      <Button color="inherit" key="Login" component={Link} to="/login">
        Login
      </Button>
    )}
    </div>
    <Dialog open={logoutDialogOpen} onClose={handleLogoutDialogClose}>
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  const renderMobileMenu = () => (
    <>
    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
      <List>
        <ListItem key='Actors' component={Link} to="/actors" onClick={toggleDrawer(false)}>
          <ListItemText primary='Actors' />
        </ListItem>
        <ListItem key='Directors' component={Link} to="/directors" onClick={toggleDrawer(false)}>
          <ListItemText primary='Directors' />
        </ListItem>
        <ListItem key='Movies' component={Link} to="/movies" onClick={toggleDrawer(false)}>
          <ListItemText primary='Movies' />
        </ListItem>
        {user.accessToken ? (
          <ListItem key='Logout' onClick={handleLogoutDialogOpen}>
            <ListItemText primary='Logout' />
          </ListItem>
        ) : (
          <ListItem key='Login' component={Link} to="/login" onClick={toggleDrawer(false)}>
            <ListItemText primary='Login' />
          </ListItem>
        )}
         {(user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_USER') && (
          <ListItem key='Profile' component={Link} to={`/profile/${user.userId}`} onClick={toggleDrawer(false)}>
          <ListItemText primary='Profile' />
        </ListItem>
        )}
        {(user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_USER') && (
          <ListItem
            key="ContentPanel"
            component={Link}
            to="/content-panel"
            onClick={toggleDrawer(false)}
          >
            <ListItemText primary="Content Panel" />
          </ListItem>
        )}
      </List>
    </Drawer>
    <Dialog open={logoutDialogOpen} onClose={handleLogoutDialogClose}>
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                MoviePedia
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h6" >
                MoviePedia
              </Typography>
              {renderDesktopMenu()}
            </>
          )}
        </Toolbar>
      </AppBar>
      {isMobile && renderMobileMenu()}
    </div>
  );
};

export default NavigationBar;