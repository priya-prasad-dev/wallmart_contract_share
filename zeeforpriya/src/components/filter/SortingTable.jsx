import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
// import React from "react";
import { useEffect, useState } from "react";
import NewNav from '../pages/NewNav';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { Grid, TableRow } from '@mui/material';





const columns = [
//   { field: '_id', headerName: 'id', width: 70 },
  { field: 'movie_code', headerName: 'Movie Code',width: 90 },
  { field: 'title', headerName: 'Title',width: 200 },
  { field: 'release_date', headerName: 'Release Date',width: 105 },
  { field: 'director', headerName: 'Director', width: 200 },
  { field: 'producer', headerName: 'Producer', width: 140 },
  { field: 'actors', headerName: 'Actors', width: 200 },
  { field: 'audio_language', headerName: 'Audio Languages', width: 150 },
  { field: 'createdAt', headerName: 'CreatedAt', width: 200 },
  { field: 'updatedAt', headerName: 'UpdatedAt',width: 200},
];

const SortingTable = () => {

    const [rows, setUser] = useState([]);


    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        const result = await axios.get("http://localhost:8080/api/users/show_Details")
        // const result = await axios.get("http://jsonplaceholder.typicode.com/users")

        // console.log(result);
        setUser(result.data);
      //  setSearch(result.data);
    }



  return (
    <>
    <NewNav/>
    {/* <div style={{ height: 400, width: '100%' }}> */}
    <div style={{ height: 400, width: '100%'}}>
    
      <DataGrid
        rows={rows}
        columns={columns}
        search
        getRowId={(row) => row._id}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    
     
     
      
    </div>
    </>
  );
}


export default SortingTable 