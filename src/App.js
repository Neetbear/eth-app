import React, { useState } from "react";
import { ethers, BigNumber } from "ethers";
import "./App.css";
import { Button, Card } from "react-bootstrap";
// import { Seaport } from "@opensea/seaport-js";
import { ItemType } from '@opensea/seaport-js/lib/constants';
import { seaport, createOrder721ToEther, createOrder721To20, fulfillOrder, cancelOrder } from "./api";
import axios from 'axios';

function App() {
  const [data, setdata] = useState({
    address: "",
    Balance: null
  });
  const [currentOrder, setorder] = useState(null);

  const btnhandler = async () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => getbalance(res[0]));
    } else {
      alert("install metamask extension!!");
    }
  };

  const getbalance = (address) => {
    window.ethereum
      .request({ 
        method: "eth_getBalance", 
        params: [address, "latest"] 
      })
      .then((balance) => {
        setdata({
          address: address,
          Balance: ethers.utils.formatEther(balance)
        });
      });
  };

  const orderhandler = async () => {
    console.log(seaport)
    if (seaport !== null || data.address !== "") {
      const endTime = "1675033103";
      const offerItemAddr = "0x9AF2DBa1ca0e8C91ac1cb9B786e63F25a51DC2A0"; 
      const offerItemId = "1"; 
      const considerationAmount = ethers.utils.parseEther("0.01").toString();
      const recipient = data.address;
      const order = await createOrder721ToEther(
        endTime, 
        undefined, 
        offerItemAddr, 
        offerItemId, 
        undefined, 
        undefined, 
        undefined, 
        undefined, 
        considerationAmount,
        recipient
      );
      console.log(order)
      const response = await axios.post(
        'https://angry-donuts-fall-112-169-66-206.loca.lt/api/seaport/order/create',
        order
      )
      // setorder(order);                          // 이 부분에서 DB에 order data 저장 필요
      console.log(response);
    } 
    else {
      alert("install metamask extension!!");
    }
  };

  const fulfillhandler = async () => {
    // current Order가 아니라 DB에서 가져와야한다
    const order = await axios.get(
      `https://angry-donuts-fall-112-169-66-206.loca.lt/api/seaport/ae735313-4acd-4d53-b46d-dc29679a865c`
    )
    console.log(JSON.parse(order.data.order))
    if (seaport != null & order != null) {
      const { executeAllActions: executeAllFulfillActions } = await seaport.fulfillOrder({
        order: JSON.parse(order.data.order),
        accountAddress: data.address,
        // conduitKey: "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000"
      });

      const transaction = await executeAllFulfillActions();

      const response = await axios.patch(
        'https://angry-donuts-fall-112-169-66-206.loca.lt/api/seaport',
        {
          orderId: "ae735313-4acd-4d53-b46d-dc29679a865c",
          buyer: transaction.from
        }
      )
      console.log(response)
    } else {
      alert("install metamask extension!!");
    }
  };

  const checkhandler = async () => {
    const response = await axios.get(
      `https://angry-donuts-fall-112-169-66-206.loca.lt/api/seaport/order/0x191a0b6268C7aeaaE8C2e35Ff01199875ef49104`
    )
    console.log(response)
  };

  const cancelhandler = async () => {
    // current Order가 아니라 DB에서 가져와야한다
    if (seaport != null & currentOrder != null) {
      const orderCancel = await cancelOrder(currentOrder);
      console.log(orderCancel);
      setorder(null);
    } else {
      alert("install metamask extension!!");
    }
  };
  const bulkhandler = async () => {
    // current Order가 아니라 DB에서 가져와야한다
    if (seaport != null) {
      const bulkCancel = await seaport.bulkCancelOrders(data.address).transact();
      console.log(bulkCancel);
      setorder(null);
    } else {
      alert("install metamask extension!!");
    }
  };
  
  return (
    <div className="App">
      {/* Calling all values which we 
       have stored in usestate */}
  
      <Card className="text-center">
        <Card.Header>
          <strong>Address: </strong>
          {data.address}
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>Balance: </strong>
            {data.Balance}
          </Card.Text>
          <Button onClick={btnhandler} variant="primary">
            Connect to wallet
          </Button>
          <Button onClick={orderhandler} variant="primary">
            Make order
          </Button>
          <Button onClick={fulfillhandler} variant="primary">
            fulfill order
          </Button>
          <Button onClick={checkhandler} variant="primary">
            check current order
          </Button>
          <Button onClick={cancelhandler} variant="primary">
            cancel current order
          </Button>
          <Button onClick={bulkhandler} variant="primary">
            bulk current order
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
  
export default App;