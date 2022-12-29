// import axios from "axios";
// import React ,{useState}from "react";
// import { useEffect } from "react";

// const Search = () => {
//     const [data, setdata] = useState([]);
//     const [input,setInput] = useState ('')
//     const [output,setoutput] = useState([])

// useEffect (() => {
// getData();
// },[])

//     const getData = async()=>{
//         // const res = await axios.fetch('http://localhost:8080/api/users/show_Details')
//         // const res = await axios.get('http://localhost:8080/api/users/show_Details') 
//        const res = await axios.get('https://disease.sh/v3/covid-19/countries')     // for countriess
//         setdata(res.data)
//     }


//     useEffect (() => {
//         setoutput([])
//         data.filter(val => {
//                 if(val.country.toLowerCase().includes(input.toLowerCase()))
//                 {
//                     setoutput(output =>[ ...output,val])
//                 }
//               })   
//     },[input])

//   return (
//     <>
//       <div className="templateContainer">
//         <div className="searchInput_Container">
//           <input id="searchInput" type="text" placeholder="Search here..." onChange={(event) => {
//             setInput(event.target.value);
//           }} />
//         </div>
//         <div className="template_Container">
//           {
//               output.map((item) => {
//                 return(
//                 //   <div className="template" key={item.id}>
//                   <div className="template" >
//                     {/* <p>{item.country}</p>   //for countries */}
//                     <p>{item.title}</p>
//                       {/* <h3>{item.title}</h3> */}

//                   </div> 
//                 )
//               })
//           }
//         </div>
//       </div>
//     </>
//   )
// }

// export default Search