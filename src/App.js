import './App.css';
import React, { Component } from 'react';
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK, { CoinbaseWalletProvider } from "@coinbase/wallet-sdk";
import logo from './assets/Logo.png';
import os from './assets/os.png';
import twitter from './assets/twitter.png';
import home from './assets/home-button.png';
 
var Scroll = require('react-scroll');

const ops = () => {
	window.open("https://opensea.io/collection/hime-me-please-3rd");
}

const tweet = () => {
	window.open("https://twitter.com/_hidemeplease");
}

const homeLink = () => {
	window.open("https://hidemeplease.xyz/");
}

let account;
let mintAmount = 1;
let valueOfNFTs = 0;
let totalSupplyNFT;
let maxMintNFTs;
let onlyLeft;
let owner;
let publicSale;;
let cost = '';
let maxMintAmountPerTx = '';
let publicMintMsg = "Public Mint";

let ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_mintAmount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_mintAmount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_receiver",
				"type": "address"
			}
		],
		"name": "mintForAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_cost",
				"type": "uint256"
			}
		],
		"name": "setCost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_hiddenMetadataUri",
				"type": "string"
			}
		],
		"name": "setHiddenMetadataUri",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_maxMintAmountPerTx",
				"type": "uint256"
			}
		],
		"name": "setMaxMintAmountPerTx",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "_state",
				"type": "bool"
			}
		],
		"name": "setPaused",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "_state",
				"type": "bool"
			}
		],
		"name": "setRevealed",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_uriPrefix",
				"type": "string"
			}
		],
		"name": "setUriPrefix",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_uriSuffix",
				"type": "string"
			}
		],
		"name": "setUriSuffix",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "cost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "hiddenMetadataUri",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "maxMintAmountPerTx",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "maxSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "revealed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "uriPrefix",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "uriSuffix",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "walletOfOwner",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let address = "0x1cBBF5BA9362d60747F149d4c2E35f72e1a74bC3";

let contract;

class Home extends Component {

	state = {
		walletAddress: "",
		totalSupply: "",
		onlyLeftAmount: "",
		statusError: false,
		statusLoading: false,
		success: false,
		nftMintingAmount: '1',
		totalValue: "",
		maxmint: '',
		_publicMintMsg: 'Mint Now',
		_cost: 0,
		_maxMintAmountPerTx: '',
		_owner: ''
	}

	async componentDidMount() {

		if (localStorage?.getItem('isWalletConnected') === 'true') {

			const providerOptions = {
				walletconnect: {
					package: WalletConnectProvider, // required
					options: {
						infuraId: "811915bee3744bd38afcf17ecac0f9a6" // required
					}
				},
				coinbasewallet: {
					package: CoinbaseWalletSDK, // Required
					options: {
						appName: "Aterium Universe", // Required
						infuraId: "811915bee3744bd38afcf17ecac0f9a6", // Required
						rpc: "", // Optional if `infuraId` is provided; otherwise it's required
						chainId: 1, // Optional. It defaults to 1 if not provided
						darkMode: true // Optional. Use dark theme, defaults to false
					}
				}
			};

			const web3Modal = new Web3Modal({
				network: "mainnet", // optional
				cacheProvider: true, // optional
				providerOptions // required
			});

			const provider = await web3Modal.connect();

			//  Enable session (triggers QR Code modal)
			await provider.enable();

			const web3 = new Web3(provider);
			console.log("provider : " + provider);
			// Subscribe to accounts change
			provider.on("accountsChanged", (accounts) => {
				console.log(accounts);
			});

			// Subscribe to chainId change
			provider.on("chainChanged", (chainId) => {
				console.log(chainId);
			});

			// Subscribe to provider connection
			provider.on("connect", (info) => {
				console.log(info);
				console.log("I'm LOGGED IN");
			});

			// Subscribe to provider disconnection
			provider.on("disconnect", (error) => {
				console.log(error);
			});

			// test if wallet is connected
			if (web3Modal.cachedProvider) {
				// connected now you can get accounts
				console.log("web3Modal.cachedProvider :" + web3Modal.cachedProvider);
				console.log("provider :" + provider);

				const accounts = await web3.eth.getAccounts();

				account = accounts[0];
				this.setState({ walletAddress: account });

				contract = new web3.eth.Contract(ABI, address);
				console.log("contract :" + contract);

				if (provider) {


					//	(async () => {

					if (web3Modal.cachedProvider != "walletconnect" && web3Modal.cachedProvider != "coinbasewallet") {

						const chainId = 1;

						if (window.ethereum.networkVersion !== chainId) {
							try {
								await window.ethereum.request({
									method: 'wallet_switchEthereumChain',
									params: [{ chainId: web3.utils.toHex(chainId) }],
								});
							} catch (err) {
								// This error code indicates that the chain has not been added to MetaMask.
								if (err.code === 4902) {
									await window.ethereum.request({
										method: 'wallet_addEthereumChain',
										params: [
											{
												chainName: 'Ethereum Mainnet',
												chainId: web3.utils.toHex(chainId),
												nativeCurrency: { name: 'Ethereum Mainnet', decimals: 18, symbol: 'ETH' },
												rpcUrls: ['https://mainnet.infura.io/v3/'],
											},
										],
									});
								}
							}
						}

						try {

							try {
								localStorage.setItem('isWalletConnected', true);
							} catch (ex) {
								console.log(ex)
							}

							totalSupplyNFT = await contract.methods.totalSupply().call();
							this.setState({ totalSupply: totalSupplyNFT });
							console.log("Total Supply:" + totalSupplyNFT);

							maxMintAmountPerTx = await contract.methods.maxMintAmountPerTx().call();
							this.setState({ _maxMintAmountPerTx: maxMintAmountPerTx });
							console.log("maxMintAmountPerTx:" + maxMintAmountPerTx);

							publicSale = await contract.methods.balanceOf(account).call();
							this.setState({ myNFTWallet: publicSale });

							cost = await contract.methods.cost().call();
							this.setState({ _cost: cost });
							console.log("cost :" + cost);

							owner = await contract.methods.owner().call();
							this.setState({ _owner: owner });
							console.log("Owner" + owner);

							if (owner == account) {
								console.log("owner : " + owner)
								onlyLeft = 10000 - totalSupplyNFT;

								if (mintAmount > onlyLeft) {
									mintAmount = onlyLeft;
								}

								valueOfNFTs = mintAmount * 0;
								this.setState({ nftMintingAmount: mintAmount });
								this.setState({ totalValue: valueOfNFTs });

							} else {

								mintAmount = 1;

								if (totalSupplyNFT == 10000) {

									onlyLeft = 10000 - publicSale;
									mintAmount = onlyLeft;
									this.setState({ msg: "SOLD OUT" });

								} else {
									mintAmount = 1;
									onlyLeft = maxMintAmountPerTx;

									if (mintAmount > onlyLeft) {
										mintAmount = onlyLeft;
									}


									valueOfNFTs = mintAmount * this.state._cost;
									this.setState({ nftMintingAmount: mintAmount });
									this.setState({ totalValue: valueOfNFTs });
								}
							}

						} catch (err) {
							console.log("err: " + err);
						}

					} else if (web3Modal.cachedProvider == "walletconnect") {

						const chainId = 1;

						if (WalletConnectProvider.networkVersion !== chainId) {
							try {
								await WalletConnectProvider.request({
									method: 'wallet_switchEthereumChain',
									params: [{ chainId: web3.utils.toHex(chainId) }],
								});
							} catch (err) {
								// This error code indicates that the chain has not been added to MetaMask.
								if (err.code === 4902) {
									await window.ethereum.request({
										method: 'wallet_addEthereumChain',
										params: [
											{
												chainName: 'Ethereum Mainnet',
												chainId: web3.utils.toHex(chainId),
												nativeCurrency: { name: 'Ethereum Mainnet', decimals: 18, symbol: 'ETH' },
												rpcUrls: ['https://mainnet.infura.io/v3/'],
											},
										],
									});
								}
							}
						}

						try {

							try {
								localStorage.setItem('isWalletConnected', true);
							} catch (ex) {
								console.log(ex)
							}

							totalSupplyNFT = await contract.methods.totalSupply().call();
							this.setState({ totalSupply: totalSupplyNFT });
							console.log("Total Supply:" + totalSupplyNFT);

							maxMintAmountPerTx = await contract.methods.maxMintAmountPerTx().call();
							this.setState({ _maxMintAmountPerTx: maxMintAmountPerTx });
							console.log("maxMintAmountPerTx:" + maxMintAmountPerTx);

							publicSale = await contract.methods.balanceOf(account).call();
							this.setState({ myNFTWallet: publicSale });

							cost = await contract.methods.cost().call();
							this.setState({ _cost: cost });
							console.log("cost :" + cost);

							owner = await contract.methods.owner().call();
							this.setState({ _owner: owner });
							console.log("Owner" + owner);


							if (owner == account) {
								console.log("owner : " + owner)
								onlyLeft = 10000 - totalSupplyNFT;

								if (mintAmount > onlyLeft) {
									mintAmount = onlyLeft;
								}

								valueOfNFTs = mintAmount * 0;
								this.setState({ nftMintingAmount: mintAmount });
								this.setState({ totalValue: valueOfNFTs });

							} else {
								mintAmount = 1;

								if (totalSupplyNFT == 10000) {

									onlyLeft = 10000 - publicSale;
									mintAmount = onlyLeft;
									this.setState({ msg: "SOLD OUT" });

								} else {
									mintAmount = 1;
									onlyLeft = maxMintAmountPerTx;

									if (mintAmount > onlyLeft) {
										mintAmount = onlyLeft;
									}


									valueOfNFTs = mintAmount * this.state._cost;
									this.setState({ nftMintingAmount: mintAmount });
									this.setState({ totalValue: valueOfNFTs });
								}
							}

						} catch (err) {
							console.log("err: " + err);
						}


					} else if (web3Modal.cachedProvider == "coinbasewallet") {

						const chainId = 1;

						if (CoinbaseWalletProvider.networkVersion !== chainId) {
							try {
								await CoinbaseWalletProvider.request({
									method: 'wallet_switchEthereumChain',
									params: [{ chainId: web3.utils.toHex(chainId) }],
								});
							} catch (err) {
								// This error code indicates that the chain has not been added to MetaMask.
								if (err.code === 4902) {
									await CoinbaseWalletProvider.request({
										method: 'wallet_addEthereumChain',
										params: [
											{
												chainName: 'Ethereum Mainnet',
												chainId: web3.utils.toHex(chainId),
												nativeCurrency: { name: 'Ethereum Mainnet', decimals: 18, symbol: 'ETH' },
												rpcUrls: ['https://mainnet.infura.io/v3/'],
											},
										],
									});
								}
							}
						}


						try {

							try {
								localStorage.setItem('isWalletConnected', true);
							} catch (ex) {
								console.log(ex)
							}

							totalSupplyNFT = await contract.methods.totalSupply().call();
							this.setState({ totalSupply: totalSupplyNFT });
							console.log("Total Supply:" + totalSupplyNFT);

							maxMintAmountPerTx = await contract.methods.maxMintAmountPerTx().call();
							this.setState({ _maxMintAmountPerTx: maxMintAmountPerTx });
							console.log("maxMintAmountPerTx:" + maxMintAmountPerTx);

							publicSale = await contract.methods.balanceOf(account).call();
							this.setState({ myNFTWallet: publicSale });

							cost = await contract.methods.cost().call();
							this.setState({ _cost: cost });
							console.log("cost :" + cost);

							owner = await contract.methods.owner().call();
							this.setState({ _owner: owner });
							console.log("Owner" + owner);


							if (owner == account) {
								console.log("owner : " + owner)
								onlyLeft = 10000 - totalSupplyNFT;

								if (mintAmount > onlyLeft) {
									mintAmount = onlyLeft;
								}

								valueOfNFTs = mintAmount * 0;
								this.setState({ nftMintingAmount: mintAmount });
								this.setState({ totalValue: valueOfNFTs });

							} else {
								mintAmount = 1;

								if (totalSupplyNFT == 10000) {
									onlyLeft = 10000 - publicSale;
									mintAmount = onlyLeft;
									this.setState({ msg: "SOLD OUT" });

								} else {
									mintAmount = 1;
									onlyLeft = maxMintAmountPerTx;

									if (mintAmount > onlyLeft) {
										mintAmount = onlyLeft;
									}


									valueOfNFTs = mintAmount * this.state._cost;
									this.setState({ nftMintingAmount: mintAmount });
									this.setState({ totalValue: valueOfNFTs });
								}
							}

						} catch (err) {
							console.log("err: " + err);
						}
					}


					//})();

					//.....................................................................//

					// Legacy providers may only have ethereum.sendAsync
					const chainId = await provider.request({
						method: 'eth_chainId'
					})

				} else {

					// if the provider is not detected, detectEthereumProvider resolves to null
					console.error('Please install a Valid Wallet');
					alert('A valid provider could not be found!');

				}

			}

		} else {
			console.log("NOT CONNECTED");
		}

	}

	onSubmitMinus = async event => {
		event.preventDefault();

		mintAmount = mintAmount - 1;

		if (mintAmount < 1) {
			mintAmount = 1
		}

		if (owner == account) {
			console.log("owner : " + owner)
			onlyLeft = 10000 - totalSupplyNFT;

			if (mintAmount > onlyLeft) {
				mintAmount = onlyLeft;
			}

			valueOfNFTs = mintAmount * 0;
			this.setState({ nftMintingAmount: mintAmount });
			this.setState({ totalValue: valueOfNFTs });

		} else {

			if (totalSupplyNFT < 10000) {
				onlyLeft = maxMintAmountPerTx - publicSale;

				if (mintAmount > onlyLeft) {
					mintAmount = onlyLeft;
				}

				valueOfNFTs = mintAmount * this.state._cost;
				this.setState({ nftMintingAmount: mintAmount });
				this.setState({ totalValue: valueOfNFTs });
			}
		}
	}

	onSubmitPlus = async event => {
		event.preventDefault();

		//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
		mintAmount = mintAmount + 1;

		if (owner == account) {
			console.log("owner : " + owner)
			onlyLeft = 10000 - totalSupplyNFT;

			if (mintAmount > onlyLeft) {
				mintAmount = onlyLeft;
			}

			valueOfNFTs = mintAmount * 0;
			this.setState({ nftMintingAmount: mintAmount });
			this.setState({ totalValue: valueOfNFTs });

		} else {

			if (totalSupplyNFT < 10000) {

				onlyLeft = maxMintAmountPerTx;
				console.log(onlyLeft);

				if (mintAmount > onlyLeft) {
					mintAmount = onlyLeft;
				}
				valueOfNFTs = mintAmount * this.state._cost;
				this.setState({ nftMintingAmount: mintAmount });
				this.setState({ totalValue: valueOfNFTs });
			}
		}
	}

	onSubmit2 = async event => {
		event.preventDefault();

		console.log(this.state.walletAddress);

		try {

			let owner = await contract.methods.owner().call();

			if (account != owner) {

				try {

					console.log("minAmount:" + mintAmount);
					console.log("valueOfNFTs:" + valueOfNFTs);
					console.log("cost : " + this.state.totalValue);

					this.setState({ statusError: false, statusLoading: true });
					await contract.methods.mint(mintAmount * 1).send({ gasLimit: 385000, from: account, value: this.state.totalValue * 1 });
					this.setState({ statusLoading: false, success: true });
					await new Promise(resolve => setTimeout(resolve, 5000));
					window.location.reload();

				} catch (err) {
					this.setState({ errorMassage: "ERROR : " + err.message, statusLoading: false, success: false, statusError: true });
					console.log(err);
				}

			} else {

				try {

					console.log("minAmount:" + mintAmount);
					console.log("valueOfNFTs:" + valueOfNFTs);

					this.setState({ statusError: false, statusLoading: true });
					await contract.methods.mint(mintAmount * 1).send({ gasLimit: 385000, from: account, value: this.state.totalValue * 0 });
					this.setState({ statusLoading: false, success: true });
					await new Promise(resolve => setTimeout(resolve, 5000));
					window.location.reload();

				} catch (err) {

					this.setState({ errorMassage: "ERROR : " + err.message, statusLoading: false, success: false, statusError: true });
					console.log(err);

				}
			}
		} catch (err) {
			console.log(err);
		}
	}

	walletConnect = async event => {
		event.preventDefault();

		const providerOptions = {
			walletconnect: {
				package: WalletConnectProvider, // required
				options: {
					infuraId: "811915bee3744bd38afcf17ecac0f9a6" // required
				}
			},
			coinbasewallet: {
				package: CoinbaseWalletSDK, // Required
				options: {
					appName: "Aterium Universe", // Required
					infuraId: "811915bee3744bd38afcf17ecac0f9a6", // Required
					rpc: "", // Optional if `infuraId` is provided; otherwise it's required
					chainId: 1, // Optional. It defaults to 1 if not provided
					darkMode: true // Optional. Use dark theme, defaults to false
				}
			}
		};

		const web3Modal = new Web3Modal({
			network: "mainnet", // optional
			cacheProvider: true, // optional
			providerOptions // required
		});

		const provider = await web3Modal.connect();

		//  Enable session (triggers QR Code modal)
		await provider.enable();

		const web3 = new Web3(provider);
		console.log("provider : " + provider);
		// Subscribe to accounts change
		provider.on("accountsChanged", (accounts) => {
			console.log(accounts);
		});

		// Subscribe to chainId change
		provider.on("chainChanged", (chainId) => {
			console.log(chainId);
		});

		// Subscribe to provider connection
		provider.on("connect", (info) => {
			console.log(info);
			console.log("I'm LOGGED IN");
		});

		// Subscribe to provider disconnection
		provider.on("disconnect", (error) => {
			console.log(error);
		});

		// test if wallet is connected
		if (web3Modal.cachedProvider) {
			// connected now you can get accounts
			console.log("web3Modal.cachedProvider :" + web3Modal.cachedProvider);
			console.log("provider :" + provider);

			const accounts = await web3.eth.getAccounts();

			account = accounts[0];
			this.setState({ walletAddress: account });

			contract = new web3.eth.Contract(ABI, address);
			console.log("contract :" + contract);

			if (provider) {


				//	(async () => {

				if (web3Modal.cachedProvider != "walletconnect" && web3Modal.cachedProvider != "coinbasewallet") {

					const chainId = 1;

					if (window.ethereum.networkVersion !== chainId) {
						try {
							await window.ethereum.request({
								method: 'wallet_switchEthereumChain',
								params: [{ chainId: web3.utils.toHex(chainId) }],
							});
						} catch (err) {
							// This error code indicates that the chain has not been added to MetaMask.
							if (err.code === 4902) {
								await window.ethereum.request({
									method: 'wallet_addEthereumChain',
									params: [
										{
											chainName: 'Ethereum Mainnet',
											chainId: web3.utils.toHex(chainId),
											nativeCurrency: { name: 'Ethereum Mainnet', decimals: 18, symbol: 'ETH' },
											rpcUrls: ['https://mainnet.infura.io/v3/'],
										},
									],
								});
							}
						}
					}

					try {

						try {
							localStorage.setItem('isWalletConnected', true);
						} catch (ex) {
							console.log(ex)
						}

						totalSupplyNFT = await contract.methods.totalSupply().call();
						this.setState({ totalSupply: totalSupplyNFT });
						console.log("Total Supply:" + totalSupplyNFT);

						maxMintAmountPerTx = await contract.methods.maxMintAmountPerTx().call();
						this.setState({ _maxMintAmountPerTx: maxMintAmountPerTx });
						console.log("maxMintAmountPerTx:" + maxMintAmountPerTx);

						publicSale = await contract.methods.balanceOf(account).call();
						this.setState({ myNFTWallet: publicSale });

						cost = await contract.methods.cost().call();
						this.setState({ _cost: cost });
						console.log("cost :" + cost);

						owner = await contract.methods.owner().call();
						this.setState({ _owner: owner });
						console.log("Owner" + owner);

						if (owner == account) {
							console.log("owner : " + owner)
							onlyLeft = 10000 - totalSupplyNFT;

							if (mintAmount > onlyLeft) {
								mintAmount = onlyLeft;
							}

							valueOfNFTs = mintAmount * 0;
							this.setState({ nftMintingAmount: mintAmount });
							this.setState({ totalValue: valueOfNFTs });

						} else {
							mintAmount = 1;

							if (totalSupplyNFT == 10000) {

								onlyLeft = 10000 - publicSale;
								mintAmount = onlyLeft;
								this.setState({ msg: "SOLD OUT" });

							} else {
								mintAmount = 1;
								onlyLeft = maxMintAmountPerTx;

								if (mintAmount > onlyLeft) {
									mintAmount = onlyLeft;
								}


								valueOfNFTs = mintAmount * this.state._cost;
								this.setState({ nftMintingAmount: mintAmount });
								this.setState({ totalValue: valueOfNFTs });
							}
						}


					} catch (err) {
						console.log("err: " + err);
					}

				} else if (web3Modal.cachedProvider == "walletconnect") {

					const chainId = 1;

					if (WalletConnectProvider.networkVersion !== chainId) {
						try {
							await WalletConnectProvider.request({
								method: 'wallet_switchEthereumChain',
								params: [{ chainId: web3.utils.toHex(chainId) }],
							});
						} catch (err) {
							// This error code indicates that the chain has not been added to MetaMask.
							if (err.code === 4902) {
								await window.ethereum.request({
									method: 'wallet_addEthereumChain',
									params: [
										{
											chainName: 'Ethereum Mainnet',
											chainId: web3.utils.toHex(chainId),
											nativeCurrency: { name: 'Ethereum Mainnet', decimals: 18, symbol: 'ETH' },
											rpcUrls: ['https://mainnet.infura.io/v3/'],
										},
									],
								});
							}
						}
					}


					try {

						try {
							localStorage.setItem('isWalletConnected', true);
						} catch (ex) {
							console.log(ex)
						}

						totalSupplyNFT = await contract.methods.totalSupply().call();
						this.setState({ totalSupply: totalSupplyNFT });
						console.log("Total Supply:" + totalSupplyNFT);

						maxMintAmountPerTx = await contract.methods.maxMintAmountPerTx().call();
						this.setState({ _maxMintAmountPerTx: maxMintAmountPerTx });
						console.log("maxMintAmountPerTx:" + maxMintAmountPerTx);

						publicSale = await contract.methods.balanceOf(account).call();
						this.setState({ myNFTWallet: publicSale });

						cost = await contract.methods.cost().call();
						this.setState({ _cost: cost });
						console.log("cost :" + cost);

						owner = await contract.methods.owner().call();
						this.setState({ _owner: owner });
						console.log("Owner" + owner);

						if (owner == account) {
							console.log("owner : " + owner)
							onlyLeft = 10000 - totalSupplyNFT;

							if (mintAmount > onlyLeft) {
								mintAmount = onlyLeft;
							}

							valueOfNFTs = mintAmount * 0;
							this.setState({ nftMintingAmount: mintAmount });
							this.setState({ totalValue: valueOfNFTs });

						} else {
							mintAmount = 1;

							if (totalSupplyNFT == 10000) {

								onlyLeft = 10000 - publicSale;
								mintAmount = onlyLeft;
								this.setState({ msg: "SOLD OUT" });

							} else {
								mintAmount = 1;
								onlyLeft = maxMintAmountPerTx;

								if (mintAmount > onlyLeft) {
									mintAmount = onlyLeft;
								}


								valueOfNFTs = mintAmount * this.state._cost;
								this.setState({ nftMintingAmount: mintAmount });
								this.setState({ totalValue: valueOfNFTs });
							}
						}


					} catch (err) {
						console.log("err: " + err);
					}

				} else if (web3Modal.cachedProvider == "coinbasewallet") {

					const chainId = 1;

					if (CoinbaseWalletProvider.networkVersion !== chainId) {
						try {
							await CoinbaseWalletProvider.request({
								method: 'wallet_switchEthereumChain',
								params: [{ chainId: web3.utils.toHex(chainId) }],
							});
						} catch (err) {
							// This error code indicates that the chain has not been added to MetaMask.
							if (err.code === 4902) {
								await CoinbaseWalletProvider.request({
									method: 'wallet_addEthereumChain',
									params: [
										{
											chainName: 'Ethereum Mainnet',
											chainId: web3.utils.toHex(chainId),
											nativeCurrency: { name: 'Ethereum Mainnet', decimals: 18, symbol: 'ETH' },
											rpcUrls: ['https://mainnet.infura.io/v3/'],
										},
									],
								});
							}
						}
					}

					try {

						try {
							localStorage.setItem('isWalletConnected', true);
						} catch (ex) {
							console.log(ex)
						}

						totalSupplyNFT = await contract.methods.totalSupply().call();
						this.setState({ totalSupply: totalSupplyNFT });
						console.log("Total Supply:" + totalSupplyNFT);

						maxMintAmountPerTx = await contract.methods.maxMintAmountPerTx().call();
						this.setState({ _maxMintAmountPerTx: maxMintAmountPerTx });
						console.log("maxMintAmountPerTx:" + maxMintAmountPerTx);

						publicSale = await contract.methods.balanceOf(account).call();
						this.setState({ myNFTWallet: publicSale });

						cost = await contract.methods.cost().call();
						this.setState({ _cost: cost });
						console.log("cost :" + cost);

						owner = await contract.methods.owner().call();
						this.setState({ _owner: owner });
						console.log("Owner" + owner);


						if (owner == account) {
							console.log("owner : " + owner)
							onlyLeft = 10000 - totalSupplyNFT;

							if (mintAmount > onlyLeft) {
								mintAmount = onlyLeft;
							}

							valueOfNFTs = mintAmount * 0;
							this.setState({ nftMintingAmount: mintAmount });
							this.setState({ totalValue: valueOfNFTs });

						} else {
							mintAmount = 1;

							if (totalSupplyNFT == 10000) {

								onlyLeft = 10000 - publicSale;
								mintAmount = onlyLeft;
								this.setState({ msg: "SOLD OUT" });

							} else {
								mintAmount = 1;
								onlyLeft = maxMintAmountPerTx;

								if (mintAmount > onlyLeft) {
									mintAmount = onlyLeft;
								}


								valueOfNFTs = mintAmount * this.state._cost;
								this.setState({ nftMintingAmount: mintAmount });
								this.setState({ totalValue: valueOfNFTs });
							}
						}


					} catch (err) {
						console.log("err: " + err);

					}

				}


				//})();

				//.....................................................................//

				// Legacy providers may only have ethereum.sendAsync
				const chainId = await provider.request({
					method: 'eth_chainId'
				})

			} else {

				// if the provider is not detected, detectEthereumProvider resolves to null
				console.error('Please install a Valid Wallet');
				alert('A valid provider could not be found!');

			}

		}

	}

	walletDisconnect = async event => {
		event.preventDefault();

		const providerOptions = {
			walletconnect: {
				package: WalletConnectProvider, // required
				options: {
					infuraId: "bf933c3446b3464c988114813a1360ac" // required
				}
			}
		};

		const web3Modal = new Web3Modal({
			network: "mainnet", // optional
			cacheProvider: true, // optional
			providerOptions // required
		});

		// disconnect wallet
		web3Modal.clearCachedProvider();
		window.location.reload();

		try {
			localStorage.setItem('isWalletConnected', false);
		} catch (ex) {
			console.log(ex);
		}

	}

	render() {

		return (

			<div class="allWrap">
				<div class="light">
					<div class="cont">

						<div class="headers">

							<div class="headers2">

								<div class="logo"><img class="logoPic" onClick={homeLink} src={logo} /></div>

								<div class="right">

									<div class="icons">
										<div class="socialIcon"><img onClick={homeLink} src={home} /></div>
										<div class="socialIcon"><img onClick={ops} src={os} /></div>
										<div class="socialIcon"><img onClick={tweet} src={twitter} /></div>
									</div>

									<div class="connect2">
										{this.state.walletAddress === '' ?
											(<form onSubmit={this.walletConnect}>
												<button class="wallet2">Wallet Connect</button>
											</form>) : (<form onSubmit={this.walletDisconnect}><button class="wallet2" >
												{this.state.walletAddress.slice(0, 3) + "..." + this.state.walletAddress.slice(39, 42)}</button></form>)}
									</div>

								</div>

							</div>

						</div>

						<div class="introduction">

							<div class="in2">
								<div class="intro">
									하이드미플리즈 3차 NFT
								</div>

								{/* <div class="intro2">
									Welcome to the home of HIDE ME PLEASE. Discover the best items in this collection.!
								</div> */}

								<div class="nftblockWalletConnectedALL">
									{this.state.walletAddress === '' ? (
										<div class="walletConnect">
											<form onSubmit={this.walletConnect}>
												<button class="wallet3" type='submit'>MINT NOW</button>
											</form>
										</div>
									) : null}
								</div>
							</div>

							{this.state.walletAddress === '' ?

								(<div class="nftPicDiv">
									<img class="nftPic" src='https://cdn.discordapp.com/attachments/1050552088779825176/1132041926456119367/hmp_nft.gif' />
								</div>) : (

									(<div class="mintDiv">
										<div class="totalSupply">{this.state.totalSupply} / 10000</div>
										{this.state._maxMintAmountPerTx == this.state.myNFTWallet ?

											(<div class="price"><div>Limit Reached!</div></div>) :
											(<div class="price"><div>Mint Price {this.state._cost / 1000000000000000000} ETH</div></div>)}

										<div class="minting_count_button">

											<div class="center">
												<form onSubmit={this.onSubmitMinus}>
													<button class="btnfos-0-2" type="submit">-</button>
												</form>
											</div>

											<div>
												<div class="nftminter2">{this.state.nftMintingAmount}</div>
											</div>


											<div class="center">
												<form onSubmit={this.onSubmitPlus}>
													<button class="btnfos-0-2" type="submit">+</button>
												</form>
											</div>
										</div>

										<div class="mintbuttondiv">
											<form onSubmit={this.onSubmit2}>
												<button class="btnfos-0-3" type="submit">
													{this.state._publicMintMsg}</button>
											</form>

										</div>
										<div>

											{this.state.statusError ? (
												<div class="errorMessage">
													<div >Sorry, something went wrong <br /> please try again later</div>
												</div>)
												: null}

											{this.state.statusLoading ? (
												<div class="loadingContainer">
													<div class="loadingText">Minting your NFT</div>
												</div>)
												: null}

											{this.state.success ? (
												<div class="successfully">MINTING SUCCESSFUL!</div>
											)									
												: null}

										</div></div>

									)
								)}
						</div>
					</div>
				</div >
			</div >)
	}
}

export default Home;
