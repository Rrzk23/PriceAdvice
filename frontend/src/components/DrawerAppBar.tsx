import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import {User} from '../models/user';
import { Link } from 'react-router-dom';

const drawerWidth = 240;


// from https://mui.com/material-ui/react-app-bar/
interface DrawerAppBarProps {
  window? : () => Window;
  loggedUser: User|null;
  
  onLogoutClick: () => void;
  
}

interface NavItem {
  name: string;
  text: string;
}

const unloggedInItems : NavItem[] = [
  { name: 'login', text: 'Login' },
  { name: 'signup', text: 'Sign Up' },
]

export default function DrawerAppBar(props: DrawerAppBarProps) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [items, setItems] = React.useState<NavItem[]>(unloggedInItems);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleDrawerButtonClick = (item : string) => {
    // TODO: Implement navigation based on item
    switch (item) {
      case 'logout':
        props.onLogoutClick();
        break;
      default:
        console.error('Invalid nav item:', item);
        return;  // Ensure the function doesn't continue if the invalid item is provided.
    }
    
  }
  React.useEffect(() => {

    if (props.loggedUser) {
      //items.filter(item => item !== 'Login');
      setItems([
       // {name: 'profile', text: 'Profie'}, 
        {name: 'logout', text: 'Log out'},
        {name: 'username', text: `Signed in as ${props.loggedUser.username}`}
      ] 
      );
    } else {
      setItems(unloggedInItems);
    }
  }, [props.loggedUser]);
// change the drawer map to set which button should be disable can do a filter or something.
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        LOGO
      </Typography>
      <Divider />
      <List>
        
        {items.map((item) => (
          <Link to={`/${item.name}`}>
          <ListItem key={item.name} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
          </Link>
        ))}
        
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              ICON
              
            </Typography>
          
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            
            {items.map((item) => (
              <Link to={`/${item.name}`}>
                <Button key={item.name} sx={{ color: '#fff' }} onClick={() => handleDrawerButtonClick(item.name)}>
                  {item.text}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}