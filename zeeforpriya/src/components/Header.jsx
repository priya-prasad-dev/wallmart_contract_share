import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { AppBar, Menu, Toolbar,Badge } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from '@mui/icons-material/Notifications';
//import Logo from '../assets/Logo.png'
import zee5 from '../assets/zee5.svg'

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static" sx={{ background: "#300430" }}>
        <Toolbar>
          {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}
       
        <img src={zee5} alt="Logo" width="50px"/>
          <Badge  sx={{ marginLeft: "90%" }} color="error">
            <NotificationsIcon />
          </Badge>
          <IconButton
            onClick={handleMenu}
            sx={{ marginLeft: "auto" }}
            color="inherit"
          >
            
            <AccountCircleRoundedIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Hi! Shakya</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
