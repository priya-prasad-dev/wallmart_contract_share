
import { Table, TableBody, TableCell, TableHead, TableRow, styled, TextField} from "@mui/material";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from "react-router-dom";


const StyledTable = styled(Table)
    `
width:90%;
margin: 50px auto 0 auto;
`
const THead = styled(TableRow)
    `
background:#66625e;
& > th {
    color:#fff;
    font-size:20px;
}
`
// const TBody = styled(TableRow)
// `& > td {
//     font-size:20px;
// }
// `


const AllUsers = () => {
    const [Search, setSearch] = useState('')
    const [filterData, setFilterData] = useState([])
    const [users, setUser] = useState([]);
    // const [sortValue,setSortValue] = useState ("")

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        const result = await axios.get("http://localhost:8080/api/users/show_Details")
        // console.log(result);
        setUser(result.data);
        setSearch(result.data);
    }

// * sorting not working
// START
    // const handleSort = async(e) => {
    //     let value =e.target.value;
    //     setSortValue(users);
    //     return await axios
    //     .get(`http://localhost:8080/api/users/show_Details?=${value}&_order=asc`)
    //     .then((response) => {
    //         setUser(response.data);
    //     })
    //     .catch((err)=> console.log(err));
    // }

   // const sortOptions = ["title","director"]

// END

    const deleteData = async (id) => {
        await axios.delete(`http://localhost:8080/api/users/delete_Details/${id}`)
        // console.log(result);
        getUsers();
    }

    // const  = async () => {
    //     const result = await axios.get("http://localhost:8080/api/users/show_Details")
    //     // console.log(result);
    //     setUser(result.data);
    //     setSearch(result.data);
    // }

// const handleReset = () => {
// getUsers();
// }

// const handleSearch = async(e) => {
// e.preventdefault();
// return await axios.get(`http://localhost:8080/api/users/show_Details=${filterData}`)
// .then((response) => {
// setUser(response.data);
// setFilterData("")
// })
// .catch((err) => console.log(err))
// }



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
            

            <TextField
                type="search"
                placeholder="Search movie"
                value={[filterData]}
                onInput={(e) => handleFilter(e)}
            />

            <StyledTable>
                <TableHead>
                    <THead>
                        {/* <TableCell>ID</TableCell> */}
                        <TableCell>ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Director</TableCell>
                        <TableCell>Producer</TableCell>
                        <TableCell>Actors</TableCell>
                        <TableCell>Audio Languages</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Upadated At</TableCell>
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
                            <TableCell>

                                <Link to={`/show_details/${user._id}`}>
                                    <VisibilityIcon />
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

<TableRow>
{users&& users
.sort((a,b) => a.title > b.title?1:-1)
.map(task=> {
     return(
        <TableRow key={task.title}>
{/* {task.title}-{task.title} */}
        </TableRow>
     )
})
}

</TableRow>

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


export default AllUsers