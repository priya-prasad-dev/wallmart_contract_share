import React, { useRef } from "react";
import Web3 from "web3";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { abi, address } from "../../contract/config";
const WallmartPurchase = () => {
    const wallmartRequestID = useRef();
    const sellingPrice = useRef();
  
  const DisplayVal = async () => {
    const mydata = {
        _wallmartRequestID: wallmartRequestID.current.value,
        _sellingPrice: sellingPrice.current.value,
      };
      console.log("data", mydata);
    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(abi, address);
    const Accounts = await web3.eth.getAccounts();
    const price = await contract.methods.products(mydata._wallmartRequestID).call();
    const quanty = await contract.methods.wallmartRequest(mydata._wallmartRequestID).call();
console.log("price",price);
console.log("quantyy",quanty.quantity);
console.log("amount-",price.supplierPrice)

    const productCost = price.supplierPrice * quanty.quantity;
      console.log("pcost-",productCost)
    const request = await contract.methods
    .purchaseByWallmart(mydata._wallmartRequestID,mydata._sellingPrice)
    .send({ from: Accounts[0],value:productCost})
   
    console.log(request);
  };
 
  return (
    <React.Fragment>
      <Typography gutterBottom variant="h4" align="center">
      Wallmart Purchase
      </Typography>
      <Grid>
        <Card style={{ maxWidth: 450, padding: "20px 5px", margin: "0 auto" }}>
          <CardContent>
            <Grid container spacing={1}>
              <Grid xs={12} item>
                <TextField
                  type="text"
                  inputRef={wallmartRequestID}
                  label="WallmartRequestID"
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
                
              <Grid xs={12} item>
                <TextField
                  type="text"
                  inputRef={sellingPrice}
                  label="SellingPrice"
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={DisplayVal}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </React.Fragment>
  );
};

export default WallmartPurchase;
