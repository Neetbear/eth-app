# Getting Started Seaport test with Create React App
```
npm install
npm run start
```

## 설명
현재 이 react의 test code는 내가 보유한 nft를 판매하는 경우를 가정하고 제작되어 있습니다.
임시 코드이므로 App.js 파일에서 order 정보를 수정하여 사용하면 됩니다.
offer에 판매할 nft의 정보, consideration에 대가로 받을 erc20 token이나 ether의 정보, endTime에 이 order의 마감 시간을 timeStamp 값으로 주면 됩니다.
```
const orderCreate = await seaport.createOrder(
    {
        // conduitKey: "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
        // zone: "0x00000000E88FE2628EbC5DA81d2b3CeaD633E89e",
        // zoneHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        endTime:1664428149,
        offer: [{ 
            itemType: ItemType.ERC721,
            token: "0x51Bae864d00D543F2A40f2B6A623ABBea46AeA7e", 
            identifier: "1",
            amount: "1",
            endAmount: "1"
        }],
        consideration: [{ 
            token: "0x0000000000000000000000000000000000000000",
            amount: ethers.utils.parseEther("0.01").toString(),
            endAmount: ethers.utils.parseEther("0.01").toString(),
            identifier: "0",
            recipient: data.address
        }],
        // allowPartialFills: false, 
        // restrictedByZone: true, 
        // fees:[{recipient: "0x0000a26b00c1F0DF003000390027140000fAa719", basisPoints: 250}],
    },
    data.address
);
```