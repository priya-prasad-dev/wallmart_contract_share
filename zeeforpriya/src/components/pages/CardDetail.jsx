
import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios'
import { useParams } from "react-router-dom";

const CardDetail = () => {
  const { id } = useParams();
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



  const loadUser = async () => {
    const result = await axios.get(`http://localhost:8080/api/users/single_details/${id}`)
    setData(result.data)

  }

  return (
    <>

      
      <Card style={{ maxWidth: 500, padding: "20px 10px", margin: "5% auto 0 auto" }}>
          <CardContent>

            <Typography  >
              Title:  {data.title}
            </Typography>
            <Typography>
              Release Date:{data.release_date}
            </Typography>
            <Typography>
            Director:{data.director}
            </Typography>
            <Typography>
            Producer:{data.producer}
            </Typography>
            <Typography>
            Actors:{data.actors}
            </Typography>
            <Typography>
            Audio Languages:{data.audio_language}
            </Typography>
            <Typography>
            Created At: {data.createdAt}
            </Typography>
            <Typography>
            Upadated At:{data.updatedAt}
            </Typography>
            <Grid xs={12} item>
            <Typography>
            Upadated At:{data.updatedAt}
            </Typography>
            </Grid>         
          </CardContent>

      </Card>
    </> 

  )
}

export default CardDetail