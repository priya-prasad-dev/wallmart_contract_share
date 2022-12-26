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
  
  const handleSubmit = async () => {
    const mydata = {
        _wallmartRequestID: wallmartRequestID.current.value,
        _sellingPrice: sellingPrice.current.value,
      };
      console.log("data", mydata);
    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(abi, address);
    const Accounts = await web3.eth.getAccounts();
    const product_info = await contract.methods.products(mydata._wallmartRequestID).call();
    const walllmart_req_info = await contract.methods.wallmartRequest(mydata._wallmartRequestID).call();
    console.log("full_prdct_info",product_info);
    console.log("amnt_per_unit",product_info.supplierPrice)
    console.log("wall_req_quant",walllmart_req_info.quantity);
    const productCost = product_info.supplierPrice * walllmart_req_info.quantity;
      console.log("total_amnt",productCost)
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
                  onClick={handleSubmit}
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
