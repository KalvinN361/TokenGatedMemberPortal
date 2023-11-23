import { useState, useRef } from 'react';
import { useWeb3, useUser } from '@context/index';

const SignMessage = () => {
    // Use the Web3Context to get the current instance of web3
    const { web3 } = useWeb3();
    // Use the UserContext to get the current logged-in user
    const { user } = useUser();

    // Initialize state for message and signature
    const [message, setMessage] = useState('');
    const [signature, setSignature] = useState('');

    // Define the handler for input change, it updates the message state with input value
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
        setMessage(e.target.value);

    // Define the signMessage function which is used to sign the message
    const handleSignMessage = async () => {
        if (user && web3) {
            try {
                // Sign the message using the connected wallet
                const signedMessage = await web3.eth.personal.sign(
                    message,
                    user,
                    ''
                );
                // Set the signature state with the signed message
                setSignature(signedMessage);
            } catch (error) {
                // Log any errors that occur during the signing process
                console.error('handleSignMessage:', error);
            }
        }
    };

    // Render the component
    return (
        <div className={'flex justify-start items-start'}>
            <div className={'border rounded-lg overflow-hidden p-4'}>
                <div>
                    {/* Input field for the message to be signed */}
                    <input
                        className={'w-[300px]'}
                        placeholder="Set Message"
                        maxLength={20}
                        onChange={handleInput}
                    />
                    {/* Button to trigger the signMessage function */}
                    <button onClick={handleSignMessage} disabled={!message}>
                        Sign Message
                    </button>
                </div>
                {/* Display the signature if available */}
                {signature && <p>{`Signature: ${signature}`}</p>}
            </div>
        </div>
    );
};

export default SignMessage;
