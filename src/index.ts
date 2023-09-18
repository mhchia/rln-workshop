import { ethers } from "ethers";
import { RLN, RLNFullProof, Status, calculateExternalNullifier, calculateIdentityCommitment } from "rlnjs";
import { Identity } from "@semaphore-protocol/identity";


/* Configs */
const rlnWorkshopContractABI = '[{"inputs": [{"internalType": "uint256", "name": "minimalDeposit", "type": "uint256"}, {"internalType": "uint256", "name": "maximalRate", "type": "uint256"}, {"internalType": "uint256", "name": "depth", "type": "uint256"}, {"internalType": "uint8", "name": "feePercentage", "type": "uint8"}, {"internalType": "address", "name": "feeReceiver", "type": "address"}, {"internalType": "uint256", "name": "freezePeriod", "type": "uint256"}, {"internalType": "address", "name": "_token", "type": "address"}, {"internalType": "address", "name": "_verifier", "type": "address"}, {"internalType": "address", "name": "_rlnVerifier", "type": "address"}], "stateMutability": "nonpayable", "type": "constructor"}, {"anonymous": false, "inputs": [{"indexed": false, "internalType": "uint256", "name": "identityCommitment", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "messageLimit", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "index", "type": "uint256"}], "name": "MemberRegistered", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": false, "internalType": "uint256", "name": "index", "type": "uint256"}, {"indexed": false, "internalType": "address", "name": "slasher", "type": "address"}], "name": "MemberSlashed", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": false, "internalType": "uint256", "name": "index", "type": "uint256"}], "name": "MemberWithdrawn", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": false, "internalType": "uint256", "name": "x", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "y", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "nullifier", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "externalNullifier", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "root", "type": "uint256"}, {"indexed": false, "internalType": "uint256[8]", "name": "proof", "type": "uint256[8]"}], "name": "NewMessage", "type": "event"}, {"inputs": [], "name": "EXTERNAL_NULLIFIER", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "FEE_PERCENTAGE", "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "FEE_RECEIVER", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "FREEZE_PERIOD", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "MAXIMAL_RATE", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "MINIMAL_DEPOSIT", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "SET_SIZE", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "identityCommitmentIndex", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "name": "members", "outputs": [{"internalType": "address", "name": "userAddress", "type": "address"}, {"internalType": "uint256", "name": "messageLimit", "type": "uint256"}, {"internalType": "uint256", "name": "index", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "identityCommitment", "type": "uint256"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}], "name": "register", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "identityCommitment", "type": "uint256"}], "name": "release", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [], "name": "rlnVerifier", "outputs": [{"internalType": "contract IRLNVerifier", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "y", "type": "uint256"}, {"internalType": "uint256", "name": "root", "type": "uint256"}, {"internalType": "uint256", "name": "nullifier", "type": "uint256"}, {"internalType": "uint256", "name": "x", "type": "uint256"}, {"internalType": "uint256", "name": "externalNullifier", "type": "uint256"}, {"internalType": "uint256[8]", "name": "proof", "type": "uint256[8]"}], "name": "sendMessage", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "identityCommitment", "type": "uint256"}, {"internalType": "address", "name": "receiver", "type": "address"}, {"internalType": "uint256[8]", "name": "proof", "type": "uint256[8]"}], "name": "slash", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [], "name": "token", "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "verifier", "outputs": [{"internalType": "contract IVerifier", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "identityCommitment", "type": "uint256"}, {"internalType": "uint256[8]", "name": "proof", "type": "uint256[8]"}], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "name": "withdrawals", "outputs": [{"internalType": "uint256", "name": "blockNumber", "type": "uint256"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}, {"internalType": "address", "name": "receiver", "type": "address"}], "stateMutability": "view", "type": "function"}]'
// Check out the contract in https://goerli.etherscan.io/address/0xc0B896A89eba94Bd6DA2a6c85118e7856172F9C4#code#F1#L14
const rlnWorkshopContractAddress = "0xc0B896A89eba94Bd6DA2a6c85118e7856172F9C4"
const rlnWorkshopContractAtBlock = 9716796

// Unique id for an app using RLN.
// This must be different than other app otherwise
const rlnIdentifier = BigInt(5566)
// User's message limit. By default it should be 1
const messageLimit = BigInt(1);
// Current timestamp. Now we use a constant value for simplicity
const epoch = BigInt(1234);
const externalNullifier = calculateExternalNullifier(epoch, rlnIdentifier)
// Ethereum account that gets the funds from slashed users
// See how much the receiver has earned by slashing here: https://goerli.etherscan.io/address/0x1111111111111111111111111111111111155688
const slashReceiver = "0x1111111111111111111111111111111111155688"

let isInitialized = false;

let identity: Identity;
let provider: ethers.BrowserProvider;
let signer: ethers.JsonRpcSigner;
let userRLN: RLN;
let slasherRLN: RLN;
let rlnContract: ethers.Contract;

async function init() {
    const IDENTITY_KEY_LOCAL_STORAGE = "identity";
    // Load identity from local storage or create new one
    const storedIdentity = localStorage.getItem(IDENTITY_KEY_LOCAL_STORAGE);
    if (storedIdentity) {
        identity = new Identity(storedIdentity);
        console.log("Loaded identity from local storage");
    } else {
        identity = new Identity();
        localStorage.setItem(IDENTITY_KEY_LOCAL_STORAGE, identity.toString());
        console.log("Created new identity");
    }
    provider = new ethers.BrowserProvider((window as any).ethereum);
    signer = await provider.getSigner();
    rlnContract = new ethers.Contract(rlnWorkshopContractAddress, rlnWorkshopContractABI, signer);
    const contractExternalNullifier = await rlnContract.EXTERNAL_NULLIFIER()
    if (contractExternalNullifier !== externalNullifier) {
        throw new Error("External nullifier mismatch")
    }

    // FIXME: 1. Create RLN instances for user and slasher
    [userRLN, slasherRLN] = await Promise.all([
        RLN.createWithContractRegistry({
            /* Required */
            rlnIdentifier,
            provider,
            contractAddress: rlnWorkshopContractAddress,
            identity,
            /* Optional */
            contractAtBlock: rlnWorkshopContractAtBlock,
            signer,
        }),
        RLN.createWithContractRegistry({
            rlnIdentifier,
            provider,
            contractAddress: rlnWorkshopContractAddress,
            contractAtBlock: rlnWorkshopContractAtBlock,
            signer,
        })
    ])
    isInitialized = true;
    console.log("Finished initialization")
    setButtonsState(true);
}

async function register() {
    if (!isInitialized) {
        console.error("RLN not initialized");
        return;
    }
    // FIXME: 2. User registers
    await userRLN.register(messageLimit);
}

async function sendMessage() {
    if (!isInitialized) {
        console.error("RLN not initialized");
        return;
    }
    const messageInput = document.getElementById("messageInput") as HTMLInputElement;
    const message = messageInput.value;
    if (message.trim() === "") {
        return;
    }

    console.log("Creating proof for message")
    // FIXME: 3. User creates a proof for message
    const proof = await userRLN.createProof(epoch, message);

    // FIXME: 4. User verifies the proof before sending it
    if (!await userRLN.verifyProof(epoch, message, proof)) {
        throw new Error("Proof is not valid")
    }

    console.log("Sending message")
    // FIXME: 5. User sends the proof (message) to the RLN Workshop contract
    // Tip: use `sendProofToContract` function
    await sendProofToContract(proof);
    console.log(`Sent message: epoch=${epoch}, message=${message}`);

    // Clear the input after sending the message
    messageInput.value = "";
}

type EventNewMessage = {
    x: bigint,
    y: bigint,
    nullifier: bigint,
    externalNullifier: bigint,
    root: bigint,
    proof: any,
}

// Keep listening to the contract and slash if someone exceeds their message limit
async function runSlasher() {
    while (true) {
        if (!isInitialized) {
            console.log("Slasher: slasher is yet initialized. Wait for 3 more seconds")
            await sleep(3);
            continue;
        }
        // Get messages from the contract
        const newMessages = await getNewMessages()
        for (const message of newMessages) {
            const fullProof = {
                snarkProof: {
                    proof: message.proof,
                    publicSignals: {
                        x: message.x,
                        externalNullifier: message.externalNullifier,
                        y: message.y,
                        root: message.root,
                        nullifier: message.nullifier,
                    }
                },
                epoch,
                rlnIdentifier,
            }
            // FIXME: 6. Slasher saves the proof and checks if the user can be slashed
            const res = await slasherRLN.saveProof(fullProof)
            if (res.status == Status.VALID || res.status == Status.DUPLICATE) {
                // DO NOTHING
            } else if (res.status == Status.BREACH) {
                const identitySecret = res.secret
                if (identitySecret === undefined) {
                    throw new Error("identitySecret is undefined")
                }
                const identityCommitment = calculateIdentityCommitment(identitySecret)
                const canSlash = await slasherRLN.isUserRegistered(identityCommitment)
                if (canSlash) {
                    console.log(`Slasher: user ${identityCommitment} can be slashed`)
                    try {
                        // FIXME: 7. Slasher slashes any user that exceeds their message limit
                        await slasherRLN.slash(identitySecret, slashReceiver)
                        console.log(`Slasher: slashed ${identityCommitment}: secret=${identitySecret}}`)
                    } catch (e) {
                        console.error("Slasher: failed to slash: ", e)
                    }
                }
            } else {
                throw new Error(`Unknown status ${res.status}`)
            }
        }
        await sleep(5)
    }
}


async function getNewMessages() {
    const currentBlockNumber = await provider.getBlockNumber()
    const logs = await provider.getLogs({
        address: rlnWorkshopContractAddress,
        fromBlock: rlnWorkshopContractAtBlock,
        toBlock: currentBlockNumber,
    })

    async function handleLog(log: ethers.Log) {
      // event NewMessage(uint256 x, uint256 y, uint256 nullifier, uint256 externalNullifier, uint256 root, uint256[8] proof);
      const newMessageFilter = rlnContract.filters.NewMessage()
      const newMessageTopics: ethers.TopicFilter = await newMessageFilter.getTopicFilter()

      if (log.topics[0] === newMessageTopics[0]) {
        const decoded = rlnContract.interface.decodeEventLog(newMessageFilter.fragment, log.data)
        const res = {
          x: BigInt(decoded.x),
          y: BigInt(decoded.y),
          nullifier: BigInt(decoded.nullifier),
          externalNullifier: BigInt(decoded.externalNullifier),
          root: BigInt(decoded.root),
          proof: proofFromArray(decoded.proof),
        }
        return res
      } else {
        // Just skip this log
        return undefined
      }
    }
    const events = await Promise.all(logs.map(log => handleLog(log)))
    return events.filter(x => x !== undefined) as EventNewMessage[]
}

async function sleep(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function sendProofToContract(proof: RLNFullProof) {
    const publicSignals = proof.snarkProof.publicSignals;
    const txSendMessage = await rlnContract.sendMessage(
        publicSignals.y,
        publicSignals.root,
        publicSignals.nullifier,
        publicSignals.x,
        publicSignals.externalNullifier,
        proofToArray(proof.snarkProof.proof),
    )
    await txSendMessage.wait()
}

function proofToArray(proof: any) {
    return [
      proof.pi_a[0].toString(),
      proof.pi_a[1].toString(),
      proof.pi_b[0][1].toString(),
      proof.pi_b[0][0].toString(),
      proof.pi_b[1][1].toString(),
      proof.pi_b[1][0].toString(),
      proof.pi_c[0].toString(),
      proof.pi_c[1].toString(),
    ]
}

function proofFromArray(array: bigint[]) {
    const arrayBigInts = array.map(x => BigInt(x))
    return {
        pi_a: [arrayBigInts[0], arrayBigInts[1]],
        pi_b: [[arrayBigInts[3], arrayBigInts[2]], [arrayBigInts[5], arrayBigInts[4]]],
        pi_c: [arrayBigInts[6], arrayBigInts[7]],
        protocol: "groth",
        curve: "bn128",
    }
}

function setButtonsState(enabled: boolean) {
    const registerButton = document.getElementById("registerButton") as HTMLButtonElement;
    const sendMessageButton = document.getElementById("sendMessageButton") as HTMLButtonElement;

    if (registerButton) {
        registerButton.disabled = !enabled;
    }
    if (sendMessageButton) {
        sendMessageButton.disabled = !enabled;
    }
}



(window as any).register = register;
(window as any).sendMessage = sendMessage;



init().catch((e) => {
    console.error("init error: ", e)
});
runSlasher().catch((e) => {
    console.error("runSlasher error: ", e)
});
