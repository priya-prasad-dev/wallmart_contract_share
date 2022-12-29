
import { Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import { useState,useEffect } from "react";
import axios from 'axios'
import { useParams } from "react-router-dom";

const ShowDetails = () => {
const{id} = useParams();
// alert(id)
    const [data, setData] = useState({
        title: "",
        release_date: "",
        director: "",
        producer: "",
        actors: "",
        audio_language: ""
    })


   

    useEffect(() => {
        loadUser();
     // eslint-disable-next-line
    }, []);

   

    const loadUser = async () =>{
        const result = await axios.get(`http://localhost:8080/api/users/single_details/${id}`)
        setData(result.data)
         
    }

    return (
        // marginTop: "50px"
        // <Card style={{ maxWidth: 500, padding: "20px 10px", margin: "auto" }}>
        <Card style={{ maxWidth: 500, padding: "20px 10px", margin: "5% auto 0 auto" }}>
            <CardContent >

                <Typography variant="h5">
                     Details
                </Typography>
                {/* <form  onSubmit={onSubmit}> */}
                    <Grid container spacing={1}>
                        {/* <Grid xs={12} sm={6} item> */}
                        <Grid xs={12} item>
                            <TextField
                                type="text"
                                label="Title"
                                placeholder="Enter Title"
                                variant="outlined"
                                name="title"
                               value={data.title}
                                // value={title}
                               // onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid xs={12} item>
                            <TextField
                                type="date"
                                // label="Release Date" 
                                placeholder="Enter Release Date"
                                variant="outlined"
                                name="release_date"
                                value={data.release_date}
                                fullWidth
                            />
                        </Grid>
                        <Grid xs={12} item>
                            <TextField
                                type="text"
                                label="Director*"
                                placeholder="Director*"
                                variant="outlined"
                                name="director"
                                value={data.director}
                                fullWidth
                            />
                        </Grid>
                        <Grid xs={12} item>
                            <TextField
                                type="text"
                                label="Producer*"
                                placeholder="Producer*"
                                variant="outlined"
                                name="producer"
                                value={data.producer}
                                fullWidth
                            />
                        </Grid>
                        <Grid xs={12} item>
                            <TextField
                                type="text"
                                label="Actors"
                                placeholder="Actors"
                                variant="outlined"
                                name="actors"
                                value={data.actors}
                                fullWidth
                            />
                        </Grid>
                        <Grid xs={12} item>
                            <TextField
                                type="text"
                                label="Audio Languages"
                                placeholder="Audio Laguages"
                                variant="outlined"
                                name="audio_language"
                                value={data.audio_language}
                                fullWidth
                            />
                        </Grid>
                       
                </Grid>
        </CardContent>

        </Card >

    )
}

export default ShowDetails