import { Card, CardContent, Grid, TextField, Button, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import axios from 'axios'
// import NewNav from "./pages/NewNav";
// import { useEffect } from "react";

const AddItems = () => {

    const [data, setData] = useState({
        title: "",
        release_date: "",
        director: "",
        producer: "",
        actors: "",
        audio_language: ""
    })


    function handleChange(event) {
        const { name, value } = event.target;

        setData(data => {
            return {
                ...data,
                [name]: value
            }
        })
    }


    function handleClick(event) {
        event.preventDefault();
        //console.log(data)
        const newData = {
            title: data.title,
            release_date: data.release_date,
            director: data.director,
            producer: data.producer,
            actors: data.actors,
            audio_language: data.audio_language
        }
        axios.post(`http://localhost:8080/add_Details`, newData)
        alert("Pikachu successfully")
    }

    

    return (
        // marginTop: "50px"
        // <Card style={{ maxWidth: 500, padding: "20px 10px", margin: "auto" }}>
        <Card style={{ maxWidth: 500, padding: "20px 10px", margin: "5% auto 0 auto" }}>
            <CardContent >

                <Typography variant="h5">
                    Add Details
                </Typography>
                {/* <form  onSubmit={onSubmit}> */}
                <form>
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
                                onChange={handleChange}
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
                                //value={release_date}
                                onChange={handleChange}
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
                                // value={director}
                                onChange={handleChange}
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
                                // value={producer}
                                onChange={handleChange}
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
                                // value={actors}
                                onChange={handleChange}
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
                                // value={audio_language}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                onClick={handleClick}

                            >
                                Submit
                            </Button>
                        </Grid>
                       
                       
                </Grid>
            </form>
        </CardContent>

        </Card >

    )
}

export default AddItems