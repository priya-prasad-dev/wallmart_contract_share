import Header from "./components/Header";
import HeadBar from "./components/HeadBar";
import AddItems from "./components/AddItems";
// import AddNavBar from "./components/AddNavBar";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import AllUsers from "./components/AllUsers";
import ShowDetails from "./components/pages/ShowDetail";
import EditDetails from "./components/pages/EditDetails";
import DeleteDetails from "./components/pages/DeleteDeails";
import NewNav from "./components/pages/NewNav";
import SortingTable from "./components/filter/SortingTable";
import DataTable from "./components/filter/DataTable.jsx";
import CardDetail from "./components/pages/CardDetail.jsx";
import ImportExcel from "./components/Import_Excel"
import ImportExcel2 from "./components/Import_Excel2";
//import Search from "./components/filter/Search";



function App() {
  return (
    <>
    
      <Header/>
      <HeadBar/>
      {/* <DataTable/> */}
      {/* <NewNav/> */}
      {/* <AddNavBar/> */}
      {/* <Search/> */}
      <Router>
        <Routes>
          <Route path='/' element={<NewNav/>} />
          {/* <Route path='/' element={<AddNavBar />} /> */}
          <Route path='/add_details' element={<AddItems />} />
          {/* <Route path='/all_Details' element={<AllUsers/>} /> */}
          <Route path='/all_Details' element={<DataTable/>} />
          <Route path='/sorting' element={<SortingTable/>} />
          <Route path='/importing' element={<ImportExcel/>} />
          <Route path='/import2' element={<ImportExcel2/>} />
          <Route path='/card/:id' element={<CardDetail/>} />
          <Route path ='/show_details/:id' element={<ShowDetails/>}/>
          <Route path ='/update_Details/:id' element={<EditDetails/>}/>
          <Route path ='/delete_details' element={<DeleteDetails/>}/>
           {/* <Route path='/adduser' component = {<AddNavBar/>}/>   // component will not wrork  */}
        </Routes>
      </Router>


    </>
  );
}
export default App;
