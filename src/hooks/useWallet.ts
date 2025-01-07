import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useWallet = () => {
	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [account, setAccount] = useState(null);
	const [address, setAddress] = useState('');
	const [isConnected, setIsConnected] = useState(false);
	
	// connect wallet 
	const connectWallet = async () => {
		if (typeof window.ethereum !== 'undefined') {
			try {
				const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
				
				// set up provider and signer
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				const signer = provider.getSigner();
				const address = await signer.getAddress();
				
				setProvider(provider)
				setSigner(signer)
				setAccount(accounts[0])
				setConnected(true)
				setAddress(address)
			} catch (error) {
				console.error('Failed to connect wallet:', error)
			} finally {
				return true;
			}
		} else {
			return false
		}
	} 
	
	// handle account change 
	useEffect(() => {
		if (window.ethereum) {
			window.ethereum.on('accountsChanged', (accounts) => {
				setAccount(accounts[0] || null);
				setIsConnected(accounts.length > 0);
			});
			
			window.ethereum.on('chainChanged', () => {
				window.location.reload();
			})
		}
	}, []);
	
	// send tx 
	const sendTransaction = async (toAddress, amount) => {
		if (!signer) {
			alert("Signer is not available");
			return;
		}
		
		try {
			const tx = {
				to: toAddress,
				value: ethers.utils.parseEther(amount)
			};
			
			const transactionResponse = await signer.sendTransaction(tx);
			await transactionResponse.wait();
		} catch (error) {
			alert("Error sending transaction: " + error)
		}
	}); 
	
	return {
		connectWallet,
		account,
		isConnected,
		sendTransaction,
		address
	}
}
