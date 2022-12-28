import React, { useRef, useState } from "react";
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

const CheckBalance = () => {
    const tokenId = useRef();
    const quantity = useRef();
    const [symbolOn, setSymbolOn] = useState();
    const [data, setData] = useState();
  const handleSubmit = async () => {
    const mydata = {
        _tokenId: tokenId.current.value,
        _quantity: quantity.current.value,
      };
      console.log("data", mydata);
    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(abi, address);
    const Accounts = await web3.eth.getAccounts();
    const request = await contract.methods
    .checkBalance(mydata._tokenId,mydata._quantity)
    .call();
    // .send({ from: Accounts[0] })
    setSymbolOn(request);
    console.log("balance",request);
    const minted = await contract.methods
    .totalMintedItems()
    .call();
    setData(minted);
    console.log("minted",minted);
  };
  return (
    <React.Fragment>
      <Typography gutterBottom variant="h4" align="center">
      Check balance
      </Typography>
      <Grid>
        <Card style={{ maxWidth: 450, padding: "20px 5px", margin: "0 auto" }}>
          <CardContent>
            <Grid container spacing={1}>
              <Grid xs={12} item>
                <TextField
                  type="text"
                  inputRef={tokenId}
                  placeholder="tokenId"
                  label="Addrs"
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              
              <Grid xs={12} item>
                <TextField
                  type="text"
                  inputRef={quantity}
                  name="mint"
                  placeholder="token"
                  label="token"
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
                  get balance
                </Button>
                <p> balance = {symbolOn}</p>
                <p> minted = {data}</p>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </React.Fragment>
  );
};

export default CheckBalance;
