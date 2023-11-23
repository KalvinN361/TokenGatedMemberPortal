import { useEffect, useState } from 'react';
import { useWeb3, useUser } from '@context/index';

const WalletDetail = () => {
    // Use the Web3Context to get the current instance of web3
    const { web3 } = useWeb3();
    // Use the UserContext to get the current logged-in user
    const { user } = useUser();

    // Initialize state variable for balance
    const [balance, setBalance] = useState('...');

    // Call the getBalance function when the user state variable changes
    useEffect(() => {
        const getBalance = async () => {
            if (!user || !web3) return;
            try {
                // If account and web3 are available, get the balance
                const balance = await web3.eth.getBalance(user);

                // Convert the balance from Wei to Ether and set the state variable
                setBalance(web3.utils.fromWei(balance, 'Gwei').substring(0, 7));
            } catch (error) {
                console.error(error);
            }
        };

        getBalance();
    }, [user]);

    // Render the account address and balance
    return (
        <div className={'flex flex-col'}>
            <p className={'font-bold'}>Address</p>
            <p className={'my-2'}>{user}</p>
            <p className={'font-bold'}>Balance</p>
            <p>{balance} ETH</p>
        </div>
    );
};

export default WalletDetail;
