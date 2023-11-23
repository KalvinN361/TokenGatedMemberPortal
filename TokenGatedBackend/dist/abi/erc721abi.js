"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abi721 = void 0;
exports.abi721 = [
    {
        inputs: [
            {
                internalType: 'string',
                name: '__name',
                type: 'string',
            },
            {
                internalType: 'string',
                name: '__symbol',
                type: 'string',
            },
            {
                internalType: 'uint256',
                name: '_price',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_maxSupply',
                type: 'uint256',
            },
            {
                internalType: 'string',
                name: '_contractMetadataURI',
                type: 'string',
            },
            {
                internalType: 'string',
                name: '_tokenMetadataURI',
                type: 'string',
            },
            {
                internalType: 'bool',
                name: '_allowBuy',
                type: 'bool',
            },
            {
                internalType: 'uint256',
                name: '_maxPerTransaction',
                type: 'uint256',
            },
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'recoveryAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'collectionOwnerAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'authorisationAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'purchaseTokenAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'managerPrimaryRoyaltyAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'customerPrimaryRoyaltyAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'secondaryRoyaltyAddress',
                        type: 'address',
                    },
                ],
                internalType: 'struct HyperMintERC721A.Addresses',
                name: '_addresses',
                type: 'tuple',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [],
        name: 'ApprovalCallerNotOwnerNorApproved',
        type: 'error',
    },
    { inputs: [], name: 'ApprovalQueryForNonexistentToken', type: 'error' },
    { inputs: [], name: 'BalanceQueryForZeroAddress', type: 'error' },
    { inputs: [], name: 'BuyDisabled', type: 'error' },
    { inputs: [], name: 'ContractCallBlocked', type: 'error' },
    { inputs: [], name: 'ImmutableRecoveryAddress', type: 'error' },
    { inputs: [], name: 'InsufficientPaymentValue', type: 'error' },
    { inputs: [], name: 'MaxPerAddressExceeded', type: 'error' },
    { inputs: [], name: 'MaxPerTransactionExceeded', type: 'error' },
    { inputs: [], name: 'MaxSupplyExceeded', type: 'error' },
    { inputs: [], name: 'MintERC2309QuantityExceedsLimit', type: 'error' },
    { inputs: [], name: 'MintToZeroAddress', type: 'error' },
    { inputs: [], name: 'MintZeroQuantity', type: 'error' },
    { inputs: [], name: 'NewSupplyTooLow', type: 'error' },
    { inputs: [], name: 'NonExistentToken', type: 'error' },
    { inputs: [], name: 'NotAuthorised', type: 'error' },
    {
        inputs: [],
        name: 'ApprovalQueryForNonexistentToken',
        type: 'error',
    },
    {
        inputs: [],
        name: 'ApproveToCaller',
        type: 'error',
    },
    {
        inputs: [],
        name: 'BalanceQueryForZeroAddress',
        type: 'error',
    },
    {
        inputs: [],
        name: 'BuyDisabled',
        type: 'error',
    },
    { inputs: [], name: 'OwnerQueryForNonexistentToken', type: 'error' },
    {
        inputs: [],
        name: 'OwnershipNotInitializedForExtraData',
        type: 'error',
    },
    { inputs: [], name: 'PayoutToCustomerFailed', type: 'error' },
    { inputs: [], name: 'PayoutToManagerFailed', type: 'error' },
    { inputs: [], name: 'PublicSaleClosed', type: 'error' },
    { inputs: [], name: 'SaleClosed', type: 'error' },
    { inputs: [], name: 'SignatureExpired', type: 'error' },
    {
        inputs: [],
        name: 'TransferCallerNotOwnerNorApproved',
        type: 'error',
    },
    { inputs: [], name: 'TransferFromIncorrectOwner', type: 'error' },
    {
        inputs: [],
        name: 'TransferToNonERC721ReceiverImplementer',
        type: 'error',
    },
    { inputs: [], name: 'TransferToZeroAddress', type: 'error' },
    { inputs: [], name: 'TransfersDisabled', type: 'error' },
    { inputs: [], name: 'URIQueryForNonexistentToken', type: 'error' },
    {
        inputs: [],
        name: 'MaxPerAddressExceeded',
        type: 'error',
    },
    {
        inputs: [],
        name: 'MaxPerTransactionExceeded',
        type: 'error',
    },
    {
        inputs: [],
        name: 'MaxSupplyExceeded',
        type: 'error',
    },
    {
        inputs: [],
        name: 'MintERC2309QuantityExceedsLimit',
        type: 'error',
    },
    {
        inputs: [],
        name: 'MintToZeroAddress',
        type: 'error',
    },
    {
        inputs: [],
        name: 'MintZeroQuantity',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NewSupplyTooLow',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotAuthorised',
        type: 'error',
    },
    {
        inputs: [],
        name: 'OwnerQueryForNonexistentToken',
        type: 'error',
    },
    {
        inputs: [],
        name: 'OwnershipNotInitializedForExtraData',
        type: 'error',
    },
    {
        inputs: [],
        name: 'PayoutCustomerFailed',
        type: 'error',
    },
    {
        inputs: [],
        name: 'PayoutHypermintFailed',
        type: 'error',
    },
    {
        inputs: [],
        name: 'PublicSaleClosed',
        type: 'error',
    },
    {
        inputs: [],
        name: 'SaleClosed',
        type: 'error',
    },
    {
        inputs: [],
        name: 'SignatureExpired',
        type: 'error',
    },
    {
        inputs: [],
        name: 'TransferCallerNotOwnerNorApproved',
        type: 'error',
    },
    {
        inputs: [],
        name: 'TransferFromIncorrectOwner',
        type: 'error',
    },
    {
        inputs: [],
        name: 'TransferToNonERC721ReceiverImplementer',
        type: 'error',
    },
    {
        inputs: [],
        name: 'TransferToZeroAddress',
        type: 'error',
    },
    {
        inputs: [],
        name: 'URIQueryForNonexistentToken',
        type: 'error',
    },
    {
        inputs: [],
        name: 'nonExistentToken',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'approved',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'bool',
                name: 'approved',
                type: 'bool',
            },
        ],
        name: 'ApprovalForAll',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousCollectionOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newCollectionOwner',
                type: 'address',
            },
        ],
        name: 'CollectionOwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'fromTokenId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'toTokenId',
                type: 'uint256',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'ConsecutiveTransfer',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousContractManager',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newContractManager',
                type: 'address',
            },
        ],
        name: 'ContractOwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [],
        name: 'addresses',
        outputs: [
            {
                internalType: 'address',
                name: 'recoveryAddress',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'collectionOwnerAddress',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'authorisationAddress',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'purchaseTokenAddress',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'managerPrimaryRoyaltyAddress',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'customerPrimaryRoyaltyAddress',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'secondaryRoyaltyAddress',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'burn',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256',
            },
        ],
        name: 'buy',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: '_amount', type: 'uint256' },
            {
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_totalPrice',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_maxPerAddress',
                type: 'uint256',
            },
            { internalType: 'uint256', name: '_expires', type: 'uint256' },
            { internalType: 'bytes', name: '_signature', type: 'bytes' },
        ],
        name: 'buyAuthorised',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'contractManager',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'contractURI',
        outputs: [{ internalType: 'string', name: 'uri', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'generalConfig',
        outputs: [
            { internalType: 'string', name: 'name', type: 'string' },
            { internalType: 'string', name: 'symbol', type: 'string' },
            {
                internalType: 'string',
                name: 'contractMetadataUrl',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'getApproved',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getTokenInfo',
        outputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'price',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'supply',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'maxSupply',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'maxPerTransaction',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct HyperMintERC721A.TokenInfo',
                name: 'tokenInfo',
                type: 'tuple',
            },
            { internalType: 'bool', name: 'allowBuy', type: 'bool' },
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'bool',
                name: 'enableOpenSeaOperatorFilterRegistry',
                type: 'bool',
            },
            {
                internalType: 'uint256',
                name: 'publicSaleDate',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'saleCloseDate',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'primaryRoyaltyFee',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'secondaryRoyaltyFee',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'maxPerTransaction',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'maxSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address[]',
                name: '_accounts',
                type: 'address[]',
            },
            {
                internalType: 'uint256[]',
                name: '_amounts',
                type: 'uint256[]',
            },
        ],
        name: 'mintBatch',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: 'tokenName',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'ownerOf',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'purchaseToken',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'managerPrimaryRoyaltyAddress',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'customerPrimaryRoyaltyAddress',
                type: 'address',
            },
        ],
        name: 'payout',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'price',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'recoverContract',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
            {
                internalType: 'uint256',
                name: '_salePrice',
                type: 'uint256',
            },
        ],
        name: 'royaltyInfo',
        outputs: [
            {
                internalType: 'address',
                name: 'royaltyAddress',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'royaltyAmount',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: '_data',
                type: 'bytes',
            },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'recoveryAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'collectionOwnerAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'authorisationAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'purchaseTokenAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'managerPrimaryRoyaltyAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'customerPrimaryRoyaltyAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'secondaryRoyaltyAddress',
                        type: 'address',
                    },
                ],
                internalType: 'struct HyperMintERC721A.Addresses',
                name: '_addresses',
                type: 'tuple',
            },
        ],
        name: 'setAddresses',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'bool', name: '_allowBuy', type: 'bool' }],
        name: 'setAllowBuy',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bool',
                name: '_allowPublicTransfer',
                type: 'bool',
            },
        ],
        name: 'setAllowPublicTransfer',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'operator', type: 'address' },
            { internalType: 'bool', name: 'approved', type: 'bool' },
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_publicSale',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_saleClosed',
                type: 'uint256',
            },
        ],
        name: 'setDates',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'bool', name: '_enable', type: 'bool' }],
        name: 'setEnableOpenSeaOperatorFilterRegistry',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '_contractURI',
                type: 'string',
            },
            { internalType: 'string', name: '_tokenURI', type: 'string' },
        ],
        name: 'setMetadataURIs',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'string', name: '_newName', type: 'string' },
            { internalType: 'string', name: '_newSymbol', type: 'string' },
        ],
        name: 'setNameAndSymbol',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_primaryFee',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_secondaryFee',
                type: 'uint256',
            },
        ],
        name: 'setRoyalty',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: '_price', type: 'uint256' },
            {
                internalType: 'uint256',
                name: '_price',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_maxSupply',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_maxPerTransaction',
                type: 'uint256',
            },
        ],
        name: 'setTokenConfig',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes4',
                name: '_interfaceId',
                type: 'bytes4',
            },
        ],
        name: 'supportsInterface',
        outputs: [{ internalType: 'bool', name: 'result', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: 'tokenSymbol',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'tokenMetadataURI',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_tokenId',
                type: 'uint256',
            },
        ],
        name: 'tokenURI',
        outputs: [
            { internalType: 'uint256', name: 'price', type: 'uint256' },
            { internalType: 'uint256', name: 'maxSupply', type: 'uint256' },
            {
                internalType: 'string',
                name: 'uri',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'addr',
                type: 'address',
            },
        ],
        name: 'totalMinted',
        outputs: [
            {
                internalType: 'uint256',
                name: 'numMinted',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_from', type: 'address' },
            { internalType: 'address', name: '_to', type: 'address' },
            { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
            { internalType: 'uint256', name: '_expires', type: 'uint256' },
            { internalType: 'bytes', name: '_signature', type: 'bytes' },
        ],
        name: 'transferAuthorised',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newContractManager',
                type: 'address',
            },
        ],
        name: 'transferContractManager',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'from', type: 'address' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'version',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
    },
];
