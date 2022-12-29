import React from "react";
import { Button,AppBar,Toolbar } from '@mui/material'
// import DeleteDetails from "./DeleteDeails";
import { Link } from "react-router-dom";

const NewNav = () => {

  return (
  <>

      <AppBar position="static" sx={{ background: "#ffffff" }}>
        <Toolbar>
            <Link to='/add_details'>
                <Button>Add Movie</Button>
                </Link>
                <Link to = '/all_Details'>
                <Button>All Movies</Button>
                </Link>
                <Link to = '/sorting'>
                <Button>Sorting</Button>
                </Link>
                <Link to = '/importing'>
                <Button>Import Excel</Button>
                </Link>
                <Link to = '/import2'>
                <Button>Import Excel New</Button>
                </Link>
        </Toolbar>
      </AppBar>
      
      </>
  );
};

export default NewNav;
