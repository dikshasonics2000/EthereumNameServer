import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal  from "web3modal";
import { ethers, providers} from "ethers";
import { useEffect, useRef, useState} from "react";

export default function Home() {
const [walletConnected, setWalletConnected] = useState(false);
const [ens, setENS] = useState("");
const [address, setAddress] = useState("");
const web3ModalRef = useRef();

const setENSOrAddress = async (address, web3Provider) => {
  var _ens = await web3Provider.lookupAddress(address);
  //looksup for addresses and if it has ens or not
  if(_ens) {
    setENS(_ens);
  } else {
    setAddress(address);
  }
};


  const getProviderOrSigner = async () => {

  const provider = await web3ModalRef.current.connect();
  const web3Provider = new providers.Web3Provider(provider);

  const { chainId } = await web3Provider.getNetwork();
  if(chainId !== 5){
 window.alert("Change the network to Goerli");
  throw new Error("Change network to Goerli");
  }
  const  signer = web3Provider.getSigner();
  const address = await signer.getAddress();

  await setENSOrAddress(address, web3Provider);
  return signer;
};
  
const connectWallet = async () => {
  try {
    await getProviderOrSigner(true);
    setWalletConnected(true);
  } catch (error) {
    console.error(error);
  }
};

const renderButton = () => {
  if(walletConnected) {
    <div>Wallet Connected</div>
  } else {
    return(
      <button onClick={connectWallet} className={styles.button}>
        Connect your Walllet
      </button> 
    );
  }
};

useEffect(() => {
 if(!walletConnected) {
  web3ModalRef.current = new Web3Modal({
    network: "goerli",
    providerOptions: {},
    disableInjectedProvider: false,
  });
  connectWallet();
 }
},[walletConnected]);


  return(
    <div>
      <Head>
        <title>ENS Dapp</title>
        <meta name= "description" content=" ENS-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={ styles.main}>
        <div>
        <h1 className={styles.title}>
           Welcome to LearnWeb3 punks - {ens ? ens : address}! 
        </h1>
      
      <div className={styles.description}>
        Its an NFT collection for Web3 students.
      </div>
     {renderButton()}
      </div>
      <div>
        <img className={styles.image} src="./learnweb3punks.png" />
      </div>
    </div>
    <footer className={styles.footer}>
      Made with &#10084; by LearnWeb3 Punks 
    </footer>
    </div>
  );
}
/*/useEffect
providerorsigner
walletconnect*/