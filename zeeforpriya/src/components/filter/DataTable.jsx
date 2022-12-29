
import { Table, TableBody, TableCell, TableHead, TableRow, styled, TextField} from "@mui/material";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from "react-router-dom";
import NewNav from "../pages/NewNav.jsx"
// import SearchBar from "material-ui-search-bar";


const StyledTable = styled(Table)
    `
width:90%;
margin: 10px auto 0 auto;
`
const THead = styled(TableRow)
    `
background:#66625e;
& > th {
    color:#fff;
    font-size:20px;
}
`
const TField = styled(TextField)
    `
margin: 10px auto 0 70px;
`
// const TBody = styled(TableRow)
// `& > td {
//     font-size:20px;
// }
// `


const DataTable = () => {
    const [Search, setSearch] = useState('')
    const [filterData, setFilterData] = useState([])
    const [users, setUser] = useState([]);
    const [order,setOrder] = useState ("ASC")

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        const result = await axios.get("http://localhost:8080/api/users/show_Details")
        // console.log(result);
        setUser(result.data);
        setSearch(result.data);
    }



    const deleteData = async (id) => {
        await axios.delete(`http://localhost:8080/api/users/delete_Details/${id}`)
        // console.log(result);
        getUsers();
    }

const Sorting = (col) => {
if (order==="ASC"){
    const sorted = [...users].sort((a,b) => 
    a[col].toLowerCase() > b[col].toLowerCase()?1:-1
    )
    setUser(sorted);
    setOrder("DSC")
}

if (order==="DSC"){
    const sorted = [...users].sort((a,b) => 
    a[col].toLowerCase() < b[col].toLowerCase()?1:-1
    )
    setUser(sorted);
    setOrder("ASC")
}
}

    const handleFilter = (e) => {
        if (e.target.value === "") {
            setUser(Search);
        } else {
            const filterResult = Search.filter((item) =>
                item.title.toLowerCase().includes(e.target.value.toLowerCase())
            );
            if (filterResult.length > 0) {
                setUser(filterResult);
            } else {
                //setUser([{title:"Item Not Available"}])
                alert("Item Not Found")
            }
        }
        setFilterData(e.target.value);
    };

    // const requestSearch = (searchedVal) => {
    //     const filterResult = Search.filter((row) => {
    //       return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    //     });
    //     setUser(filterResult);
    //   };
    
    //   const cancelSearch = () => {
    //     setFilterData("");
    //     requestSearch(filterData);
    //   };
    return (
        <>
{/* <TableRow>
                <TextField
                type="search"
                placeholder="Search movie"
                value={[filterData]}
                onChange= {(e) => setFilterData(e.target.value)}
                  />
                  <Button type="submit"  onClick={() => handleSearch()} >Search</Button>
                  <Button onClick={()=> handleReset()} >Reset</Button>

</TableRow> */}
            
<NewNav/>
            {/* <TableRow> */}
            <TField
                //label="Search"
                type="search"
                placeholder="Search movie"
                value={[filterData]}
                onInput={(e) => handleFilter(e)}
                // fullWidth
            />
            {/* </TableRow> */}
            {/* <SearchBar
          value={[filterData]}
          onChange={(searchVal) => requestSearch(searchVal)}
         onCancelSearch={() => cancelSearch()}
        /> */}
            <StyledTable>
                <TableHead>
                    <THead>
                        {/* <TableCell>ID</TableCell> */}
                        <TableCell>ID</TableCell>
                        {/* <Typography onClick={()=>Sorting("title")}>Title</Typography> */}
                        <TableCell onClick={()=>Sorting("title")}>Title</TableCell>
                        <TableCell onClick={()=>Sorting("release_date")}>Date</TableCell>
                        <TableCell onClick={()=>Sorting("director")}>Director</TableCell>
                        <TableCell onClick={()=>Sorting("producer")}>Producer</TableCell>
                        <TableCell onClick={()=>Sorting("actors")}>Actors</TableCell>
                        <TableCell onClick={()=>Sorting("audio_language")}>Audio Languages</TableCell>
                        <TableCell onClick={()=>Sorting("createdAt")}>Created At</TableCell>
                        <TableCell onClick={()=>Sorting("updatedAt")}>Updated At</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>

                    </THead>
                </TableHead>

                <TableBody>
                    {users.map((user) => (
                        // <TableRow> // u can write this too without using key will work
                        <TableRow key={user.id}> 
                            {/* <TableCell>Mov-{user.id}</TableCell> */}
                            <TableCell>Mov-{user.movie_code}</TableCell>
                            <TableCell>{user.title}</TableCell>
                            <TableCell>{user.release_date}</TableCell>
                            <TableCell>{user.director}</TableCell>
                            <TableCell>{user.producer}</TableCell>
                            <TableCell>{user.actors}</TableCell>
                            <TableCell>{user.audio_language}</TableCell>
                            <TableCell>{user.createdAt}</TableCell>
                            <TableCell>{user.updatedAt}</TableCell>
                            {/* <TableCell>

                                <Link to={`/show_details/${user._id}`}>
                                    <VisibilityIcon />
                                </Link>
                            </TableCell> */}
                            <TableCell>

                                <Link to={`/card/${user._id}`}>
                                    <VisibilityIcon/>
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Link to={`/update_Details/${user._id}`}><EditIcon /></Link>
                            </TableCell>
                            <TableCell>
                                 
                                <DeleteIcon 
                                onClick = {() => {deleteData(user._id)}}
                                />  
                                
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

                {/* <TableBody>
                {
                    users.map((user, index) => (
                        <TableRow>
                          //  <TableCell>{index +1}</TableCell>
                            <TableHead scope= "row">{index +1}</TableHead>
                            <TableCell>{user.title}</TableCell>
                            <TableCell>{user.release_date}</TableCell>
                            <TableCell>{user.director}</TableCell>
                            <TableCell>{user.producer}</TableCell>
                            <TableCell>{user.actors}</TableCell>
                            <TableCell>{user.audio_language}</TableCell>
                            <TableCell>{user.createdAt}</TableCell>
                            <TableCell>{user.updatedAt}</TableCell>
                            <TableCell>
                                < NavLink to="/show_details"><VisibilityIcon /> </NavLink >
                            </TableCell>
                            <TableCell>
                                <NavLink to="/update_Details"><EditIcon /></NavLink>
                            </TableCell>
                            <TableCell> 
                                <NavLink to = "/delete_details"><DeleteIcon /> </NavLink>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody> */}
            </StyledTable>



            {/* <TableRow>
            <TableCell>Sort By</TableCell>
                <Select
                onChange={handleSort}
                value= {sortValue}
                >
                {sortOptions.map((item,index) => (
                    <MenuItem value={item} key={index}>
                        {item}
                         </MenuItem>
                ))}
                

                </Select>
            </TableRow> */}
        </>
    )
}


export default DataTable