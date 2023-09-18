# RLN Workshop @ zkplayground.tw

https://zkplayground.tw/

## Prerequisites
### 1. Use node v16 or above.
```bash
node --version
```

### 2. Ensure Metamask is installed in your browser.

### 3. Check your balance in your Metamask wallet.
- Use the Goerli testnet.
- Should be some ethers in your wallet.
- Add testing token `0x9834BBA30277B437cc818986DB5d6D935c6Fd7Bf` to your wallet
  - Should be `5000` RLNWT in your wallet.

## Run

### 1. Install
```bash
npm install
```

### 2. Compile to code and run a web server

```bash
npm run build-and-run-server
```

### 3. Open the app in your browser.
```bash
open http://localhost:8080
```

## Contract Addresses
- RLNWorkshop RLN Contract: http://goerli.etherscan.io/address/0xD770B6B31Be078Ef758fCA98e7eC8F98B88d41cd
- RLNWorkshopToken Contract: http://goerli.etherscan.io/address/0x9834BBA30277B437cc818986DB5d6D935c6Fd7Bf
- RLNVerifier Contract: http://goerli.etherscan.io/address/0x54bc1BBd20A699Ab4cD9dCba6eA2F89Cf77FbA14
- Withdraw Verifier Contract: http://goerli.etherscan.io/address/0x92b73EAE297E68EbFf1dBc6Bb1a4Ac4472622Ec4
