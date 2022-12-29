import React, { useState } from "react";
import { AppBar, Toolbar, Tabs, Tab } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DnsIcon from '@mui/icons-material/Dns';
import './Styles.css'
// import SortingTable from "./filter/SortingTable";
import AddItems from "./AddItems"
// import NewNav from "./pages/NewNav";

const HeadBar = () => {
  const [selectedtab, setSelectedTab] = useState();
  
  const HandleChange = (e,newValue) => {
    setSelectedTab(newValue)
}

  return (
  <>
      <AppBar position="static" sx={{ background: "#ffffff" }}>
        <Toolbar>
          {/* <Tabs
            value={value}
            onChange={(e, value) => setValue(value)}
            indicatorColor="secondary"
          > */}
          <Tabs value={selectedtab} onChange={HandleChange}>
            <Tab
              icon={<HomeOutlinedIcon color="secondary" />}
              iconPosition="start"
              label="Dashboard"
            />
            
            <Tab
              icon={<ManageAccountsOutlinedIcon />}
              iconPosition="start"
              label="Role Management"
            />
            <Tab
              icon={<PersonOutlineOutlinedIcon />}
              iconPosition="start"
              label="User Management"
            />
            <Tab
              icon={<DnsIcon />}
              iconPosition="start"
              label="Master Management"
            />
            <Tab  label='Add Movie'/>

            <Tab  label='Sorting'/>
          </Tabs>
        </Toolbar>
      </AppBar>

      {selectedtab===  0}
      {selectedtab===  1  }
      {selectedtab===  2 }
      {selectedtab===  3 }
      {selectedtab===  4 && <AddItems/>}
      {selectedtab===  5 }
      </>
  );
};

export default HeadBar;
