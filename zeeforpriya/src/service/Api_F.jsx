import axios from 'axios'


export const getUser = async() =>{
    try{
return await axios.get(`http://localhost:8080/api/users/show_Details`)
    // return await axios.get(`http://localhost:8080/api/users/`)
    }catch(error){
      console.log('Error while getting all users data',error)
    }
 }
 
 