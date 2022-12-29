import React, { useState } from "react";
import * as XLSX from "xlsx";
import df from 'dateformat';
// import './Import_Excel.css'

const ImportExcel2 = () => {

  const [items, setItems] = useState([]);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer", cellDates: 'true' });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      // console.log(d)
      setItems(d);
    });
  };



  const style = {
    maxWidth: '80%',
    marginInline: 'auto',
    marginTop: '2rem'
  }

  console.log(items);


  return (

    <div style={style}>
      <input
        style={{ display: 'block', backgroundColor: 'purple', color: '#fff', padding: '1rem', borderRadius: '1rem' }}
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      />

      {items.length > 0 && <table cellPadding={10} cellSpacing={35} style={{ marginBlock: '2rem', border: '2px solid #333', padding: '1rem'}}>
         <thead>
          <tr>
            <th scope="col" >MovieCode</th>
            <th scope="col">Title</th>
            <th scope="col">Release Date</th>
            <th scope="col">Director</th>
            <th scope="col">Producer</th>
            <th scope="col">Actors</th>
            <th scope="col">Audio</th>

          </tr>
        </thead>
        <tbody>
          {

            items.map((d) => {
              const parsedDate = new Date(d.Release);
              parsedDate.setHours(parsedDate.getHours()); // utc-dates
              const value = df(parsedDate, "dd/mm/yyyy");
              console.log(value);
              return (
                <tr key={d.Item}>
                  <th>{d.MovieCode}</th>
                  <td>{d.Title}</td>
                  <td>{value}</td>
                  <td>{d.Director}</td>
                  <td>{d.Producer}</td>
                  <td>{d.Actors}</td>
                  <td>{d.Audio}</td>
                </tr>
              );
            }
            )}
        </tbody>
      </table>}
    </div>


  )
}

export default ImportExcel2