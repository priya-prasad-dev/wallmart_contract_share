// Inside admin

import React, { useState } from "react";
import Web3 from "web3";
import { abi, address } from "../../contract/config";
import { getCurrentAccount } from "../../helpers/helper";
import DataTables from "./data-table.component";
const Display = () => {
  const web3 = new Web3(Web3.givenProvider);
  const contract = new web3.eth.Contract(abi, address);
  const [alldata, setAlldata] = useState([]);
  // const [count, setCount] = useState(0);
  // const completeData = {...count,...alldata};

  const DisplayVal = async () => {
    // const mintedIitem = await contract.methods.getAllProducts().call(); 
    // const minted = await contract.methods
    // .totalMintedItems()
    // .call();
    // // setAlldata(minted);
    // console.log("minted",minted);

    // for (var input = 1; input <= minted; input++) {
    //   console.log(input);
    //  }

    //  await contract.methods
    //  .checkBalance(mydata._tokenId,mydata._quantity)
    //  .call();
     // .send({ from: Accounts[0] })
    //  setSymbolOn(request);
    //  console.log("balance",request);
    const currentAccount = await getCurrentAccount();

    let getAllData = await contract.methods.getAllProducts().call();
    getAllData = await Promise.all (getAllData.map(async(product)=> {
     const balance =   await contract.methods
     .checkBalance(currentAccount,product.id)
     .call();
      return {...product,balance:balance};
      // product.balance = 10;
      // return product;
    }))

    setAlldata(getAllData);
    console.log(getAllData);
    // const completeData = {...count,...alldata};
    // console.log("compD",completeData);
    
  };
  return (
    // sx={{ marginLeft: "10%"}}
    <>
    <div>
      <button style={{ float: "right " }}  onClick={DisplayVal}>
        GET
      </button>
      <DataTables datam={alldata}  />
      {/* <DataTables datam={completeData} /> */}
      

    </div>
    </>
  );
};

export default Display;
