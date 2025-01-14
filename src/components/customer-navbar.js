import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { AppBar, Avatar, Badge, Box, IconButton, Toolbar, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import { deepOrange, deepPurple } from '@mui/material/colors';
import { useTheme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { AccountPopover } from './account-popover';
import { getInitials } from '../utils/get-initials';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3]
}));

export const CustomerNavbar = (props) => {
  const { onSidebarOpen, ...other } = props;
  const settingsRef = useRef(null);
  const [openAccountPopover, setOpenAccountPopover] = useState(false);
    const theme = useTheme();
    const Router = useRouter();
  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280
          },
          width: {
            lg: 'calc(100% - 280px)'
          }
        }}
        {...other}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
         
          <Box sx={{ flexGrow: 1 }} />
          <HomeIcon sx={{
                    cursor: 'pointer',
                    height: 40,
                    width: 40,
                    ml: 1,
                    color:"gray"
                  }}
                  onClick={()=>{Router.push('/customers')}}/>
         
          {/* <Avatar
                  onClick={() => setOpenAccountPopover(true)}
                  ref={settingsRef}
                         
                        
                      >
                        { localStorage.getItem("username")?  getInitials(localStorage.getItem("username") ) : getInitials("Admin" )}
                      </Avatar> */}
          
        </Toolbar>
      </DashboardNavbarRoot>
      <AccountPopover
        anchorEl={settingsRef.current}
        open={openAccountPopover}
        onClose={() => setOpenAccountPopover(false)}
      />
    </>
  );
};

CustomerNavbar.propTypes = {
  onSidebarOpen: PropTypes.func
};
