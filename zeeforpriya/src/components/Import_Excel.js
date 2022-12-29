import React ,{useState} from "react";
import * as XLSX from "xlsx";

const ImportExcel = () => {

  const [items, setItems] = useState([]);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

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
     

    return(

      <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      />

      <table className="table container">
        <thead>
          <tr>
            {/* <th scope="col">Item</th>
            <th scope="col">Description</th> */}
            <th scope="col">MovieCode</th>
            <th scope="col">Title</th>
            <th scope="col">Release Date</th>
            <th scope="col">Director</th>
            <th scope="col">Producer</th>
            <th scope="col">Actors</th>
            <th scope="col">Audio</th>

          </tr>
        </thead>
        <tbody>
          {items.map((d) => (
            <tr key={d.Item}>
              <th>{d.MovieCode}</th>
              <td>{d.Title}</td>
              <td>{d.Release}</td>
              <td>{d.Director}</td>
              <td>{d.Producer}</td>
              <td>{d.Actors}</td>
              <td>{d.Audio}</td>
            </tr>
          ))}
        </tbody>
        {/* <tbody>
          {items.map((d) => (
            <tr key={d.Item}>
              <th>{d.Item}</th>
              <td>{d.Description}</td>
            </tr>
          ))}
        </tbody> */}
      </table>
    </div>


    )
}

export default ImportExcel