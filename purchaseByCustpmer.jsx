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
const CustomerPurchase = () => {
    const customerRequestID = useRef();
  
  const handleSubmit = async () => {
    const mydata = {
        _customerRequestID: customerRequestID.current.value
      };
      console.log("data",mydata);
    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(abi, address);
    const Accounts = await web3.eth.getAccounts();
    const product_info = await contract.methods.products(mydata._customerRequestID).call();
    const customer_req_info = await contract.methods.customerRequest(mydata._customerRequestID).call();
    console.log("full_prdct_info",product_info);
    console.log("amnt_per_unit",product_info.priceForCustomer)
    console.log("cust_req_quant",customer_req_info.quantity);
    const productCost = product_info.priceForCustomer *customer_req_info.quantity;
      console.log("total_amnt",productCost)
    const request = await contract.methods
    .purchaseByCustomer(mydata._customerRequestID)
    .send({ from: Accounts[0],value:productCost})
    console.log(request);
  };
 
  return (
    <React.Fragment>
      <Typography gutterBottom variant="h4" align="center">
      Customer Purchase
      </Typography>
      <Grid>
        <Card style={{ maxWidth: 450, padding: "20px 5px", margin: "0 auto" }}>
          <CardContent>
            <Grid container spacing={1}>
              <Grid xs={12} item>
                <TextField
                  type="text"
                  inputRef={customerRequestID}
                  label="customerRequestID"
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
                  purchase
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </React.Fragment>
  );
};

export default CustomerPurchase;
