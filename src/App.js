import React, { useState } from "react";
import { ethers, BigNumber } from "ethers";
import "./App.css";
import { Button, Card } from "react-bootstrap";
// import { Seaport } from "@opensea/seaport-js";
// import { ItemType } from '@opensea/seaport-js/lib/constants';
import { seaport, createOrder721ToEther, createOrder721To20, fulfillOrder, cancelOrder } from "./api";
import axios from 'axios';

function App() {
  const [data, setdata] = useState({
    address: "",
    Balance: null
  });
  const [currentOrder, setorder] = useState(null);

  // const signhandler = async () => {
  //   if (window.ethereum) {
  //     const msgParams = JSON.stringify({
  //       domain: {
  //         // Defining the chain aka Rinkeby testnet or Ethereum Main Net 
          
  //         chainId: 5,
  //         // Give a user friendly name to the specific contract you are signing for.
  //         name: 'LAZY_MARKETPLACE',
  //         // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
  //         verifyingContract: '0xA6f10FEbd0C478ce8BF5310758aE0DC32e1A2281',
  //         // Just let's you know the latest version. Definitely make sure the field name is correct.
  //         version: '0.0.1',
  //       },
    
  //       types: {
  //         structSalesOrder: [
  //             {name: "contractAddress", type: "address"},
  //             {name: "tokenId", type: "uint256"},
  //             {name: "tokenOwner", type: "address"},
  //             {name: "price", type: "uint256"},
  //             {name: "tokenURI", type: "string"},
  //             {name: "nonce", type: "uint256"},
  //         ]
  //       },
  
  //       salesOrder: {
  //           contractAddress: "0xDfd8CA5BC3F16595E5441582054c02f6B94D0fb6",
  //           tokenId: "0",
  //           tokenOwner: "0x191a0b6268C7aeaaE8C2e35Ff01199875ef49104",
  //           price: "100",
  //           tokenURI: "ipfs://test/",
  //           nonce: "0",
  //       }
  //     });
    
  //     // var from = await web3.eth.getAccounts();
    
  //     var params = [from[0], msgParams];
  //     var method = 'eth_signTypedData_v4';
    
  //     window.ethereum.sendAsync(
  //       {
  //         method,
  //         params,
  //         from: from[0],
  //       }
  //     );
  //   } else {
  //     alert("install metamask extension!!");
  //   }
  // };

  const btnhandler = async () => {
    if (window.ethereum) {
      console.log(await window.ethereum.request({method:"eth_requestAccounts"}).then((res) => ethers.utils.getAddress(res[0])));
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => getbalance(res[0]));
    } else {
      alert("install metamask extension!!");
    }
  };

  //await window.ethereum.request({method:"eth_requestAccounts"}).then((res) => ethers.utils.getAddress(res[0]))
  //0xBca19cE9bAC04454A485B830cA3ab4E3a4bD9d89
  //0xAa47c7a2225ca4A4791B3531b4Eaf839EE16826e

  const getbalance = (address) => {
    window.ethereum
      .request({ 
        method: "eth_getBalance", 
        params: [address, "latest"] 
      })
      .then((balance) => {
        setdata({
          address: ethers.utils.getAddress(address),
          Balance: ethers.utils.formatEther(balance)
        });
      });
  };

  const orderhandler = async () => {
    console.log(seaport)
    if (seaport !== null || data.address !== "") {
      const endTime = "1675033103";
      const offerItemAddr = "0x75a5dc632c5254833A9730d539cBc4576478cccb"; 
      const offerItemId = "0"; 
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
      setorder(order);
      // const response = await axios.post(
      //   'https://angry-donuts-fall-112-169-66-206.loca.lt/api/seaport/order/create',
      //   order
      // )
      // console.log(response);
    } 
    else {
      alert("install metamask extension!!");
    }
  };

  const fulfillhandler = async () => {
    // current Order가 아니라 DB에서 가져와야한다
    // const order = await axios.get(
    //   `https://angry-donuts-fall-112-169-66-206.loca.lt/api/seaport/ae735313-4acd-4d53-b46d-dc29679a865c`
    // )
    // const order = currentOrder;
    // console.log(JSON.parse(order.data.order))
    if (seaport != null & currentOrder != null) {
      const { executeAllActions: executeAllFulfillActions } = await seaport.fulfillOrder({
        order: currentOrder,
        accountAddress: data.address,
        // conduitKey: "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000"
      });

      const transaction = await executeAllFulfillActions();
      console.log(transaction);
      setorder(null);
      // const response = await axios.patch(
      //   'https://angry-donuts-fall-112-169-66-206.loca.lt/api/seaport',
      //   {
      //     orderId: "ae735313-4acd-4d53-b46d-dc29679a865c",
      //     buyer: transaction.from
      //   }
      // )
      // console.log(response)
    } else {
      alert("install metamask extension!!");
    }
  };

  const checkhandler = async () => {
    // console.log(ethers.utils.getAddress(data.address))
    console.log(currentOrder)
    // const response = await axios.get(
    //   `https://angry-donuts-fall-112-169-66-206.loca.lt/api/seaport/order/${ethers.utils.getAddress(data.address)}`
    // )
    // console.log(response)
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
          {/* <Button onClick={signhandler} variant="primary">
            v4 sign test
          </Button> */}
        </Card.Body>
      </Card>
    </div>
  );
}
  
export default App;