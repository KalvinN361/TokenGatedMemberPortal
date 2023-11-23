"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTransferEventDefinedInABI = exports.integrityCheckerForAll = void 0;
const manager_1 = require("../manager");
const console_1 = __importDefault(require("console"));
const ethers_1 = require("ethers");
const entity_1 = require("../../entity");
const chalk_1 = __importDefault(require("chalk"));
const axios_1 = __importDefault(require("axios"));
const database_1 = require("./database");
const util_1 = require("./util");
const integrityCheckerForAll = (contractId, startIndex, endIndex) => __awaiter(void 0, void 0, void 0, function* () {
    let contracts = yield (0, manager_1.getAllByContractType)('ERC721');
    console_1.default.log(`PV::${new Date().toISOString()}:: Found contracts ${contracts.length}`);
    console_1.default.log(startIndex);
    if (contractId)
        contracts = contracts.filter((c) => c.id === contractId);
    for (const contract of contracts) {
        //if (contract.id !== '45a65ea1-e349-4003-8647-2025b905980d') continue;
        console_1.default.log(`PV::${new Date().toISOString()}::Checking contract ${contract.description} at ${contract.address}`);
        if (checkContract(contract)) {
            console_1.default.log(chalk_1.default.red(`PV::${new Date().toISOString()}::Contract ${contract.description} at ${contract.address} is not valid`));
            continue;
        }
        const provider = (0, util_1.getAlchemyProvider)(contract.chainId);
        /*const provider = ethers.getDefaultProvider(
            contract.chainURL + contract.chainAPIKey
        );*/
        const Erc721Contract = new ethers_1.Contract(contract.address, contract.abi, provider);
        let minted = 0;
        if (contract.minter === 'hypermint')
            minted = parseInt(yield Erc721Contract.supply());
        else if (contract.minter === 'opensea')
            minted = parseInt(yield Erc721Contract.totalSupply());
        else
            minted = parseInt(yield Erc721Contract.getMintCount());
        let starting1contracts = ['hypermint', 'opensea'];
        let startingIndex = starting1contracts.includes(contract.minter)
            ? 1
            : 0;
        if (startIndex)
            startingIndex = startIndex;
        let endingIndex = starting1contracts.includes(contract.minter)
            ? minted + 1
            : minted;
        if (endIndex)
            endingIndex = endIndex;
        let assets = (yield (0, manager_1.getAssetsByContracts)([
            contract.id,
        ]));
        for (let i = startingIndex; i < endingIndex; i++) {
            let token = assets.find((a) => a.tokenId === i.toString());
            if (token !== undefined && token.status === 'burned') {
                console_1.default.log(chalk_1.default.yellow(`PV::${new Date().toISOString()}:: Asset ${i.toString()} was burned`));
                continue;
            }
            let dbAsset = (yield processAsset(contract, assets, i.toString(), Erc721Contract));
            if (!dbAsset)
                continue;
            let { dbOwner } = yield processOwner(i.toString(), Erc721Contract);
            let { attributes: omitted } = dbAsset, assetOnly = __rest(dbAsset, ["attributes"]);
            if (dbAsset.ownerId === dbOwner.id) {
                console_1.default.log(chalk_1.default.green(`PV::${new Date().toISOString()}:: Asset ${i.toString()} has correct owner`));
                continue;
            }
            if (dbAsset.ownerId !== dbOwner.id) {
                console_1.default.log(chalk_1.default.red(`PV::${new Date().toISOString()}:: Asset ${i.toString()} currently has owner ${dbAsset.ownerId} but should be ${dbOwner.id}`));
                assetOnly.ownerId = dbOwner.id;
                assetOnly.updatedDate = new Date();
                yield (0, manager_1.updateAssets)(assetOnly);
                //updateAssetValues.push(assetOnly);
                console_1.default.log(chalk_1.default.yellow(`PV::${new Date().toISOString()}:: Asset ${i.toString()} has been updated with new owner ${dbOwner.id}`));
            }
        }
    }
});
exports.integrityCheckerForAll = integrityCheckerForAll;
const checkContract = (contract) => {
    return (!contract ||
        !contract.chainURL ||
        !contract.chainId ||
        !contract.address);
};
const processAsset = (contract, assets, tokenId, Erc721Contract) => __awaiter(void 0, void 0, void 0, function* () {
    console_1.default.log(`PV::${new Date().toISOString()}:: Checking DB for token ${tokenId}`);
    let dbAsset = assets.find((a) => a.tokenId === tokenId);
    let tokenMetadata, tokenMetadataResult;
    try {
        let tokenUri = yield Erc721Contract.getFunction('tokenURI')(tokenId.toString());
        if (tokenUri.startsWith('ipfs://'))
            tokenUri = tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
        console_1.default.log(`PV::${new Date().toISOString()}:: Getting tokenURI ${tokenUri}`);
        let tries = 0;
        while (tries < 10) {
            yield (0, util_1.delay)(200);
            tokenMetadataResult = yield axios_1.default.get(tokenUri);
            tokenMetadata = tokenMetadataResult.data;
            tries++;
            if (tokenMetadata)
                break;
        }
        if (tokenMetadata.image && tokenMetadata.image.startsWith('ipfs://')) {
            tokenMetadata.image = tokenMetadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
        }
    }
    catch (err) {
        console_1.default.log(chalk_1.default.red(`PV::${new Date().toISOString()}:: Error getting tokenURI for ${tokenId.toString()}`));
        if (err.code === 'ETIMEDOUT') {
            console_1.default.log('Timeout error, skipping...');
        }
        tokenMetadata = null;
    }
    if (!dbAsset && tokenMetadata) {
        console_1.default.log(chalk_1.default.red(`PV::${new Date().toISOString()}:: Asset ${tokenId.toString()} does not exist in DB, adding...`));
        let newDbAsset = {
            tokenId: tokenId.toString(),
            contractId: contract.id,
            name: tokenMetadata.name,
            description: tokenMetadata.description,
            image: tokenMetadata.image,
            animation: tokenMetadata.animation_url,
        };
        console_1.default.log(chalk_1.default.yellow(`PV::${new Date().toISOString()}:: Adding asset ${tokenId.toString()}`));
        dbAsset = (yield (0, manager_1.updateAssets)(newDbAsset))[0];
        let insertAttributes = [];
        const attributes = tokenMetadata.attributes;
        if (!attributes)
            return;
        for (let attr of attributes) {
            console_1.default.log({ attr });
            if (attr.value === null || attr.value === undefined)
                continue;
            insertAttributes.push({
                assetId: dbAsset.id,
                traitType: attr.trait_type,
                value: attr.value,
            });
        }
        console_1.default.log(chalk_1.default.green(`PV::${new Date().toISOString()}:: Finished adding asset ${tokenId.toString()}`));
        console_1.default.log(chalk_1.default.yellow(`PV::${new Date().toISOString()}:: Adding attributes for asset ${tokenId.toString()}`));
        if (insertAttributes.length)
            yield (0, manager_1.updateAttributes)(insertAttributes);
        console_1.default.log(chalk_1.default.green(`PV::${new Date().toISOString()}:: Finished adding attributes for asset ${tokenId.toString()}`));
    }
    else if (dbAsset && tokenMetadata) {
        console_1.default.log(`PV::${new Date().toISOString()}:: Asset ${tokenId.toString()} exists in DB, checking for updates...`);
        let { attributes: omitted } = dbAsset, assetOnly = __rest(dbAsset, ["attributes"]);
        let isUpdate = false;
        if (dbAsset.name !== tokenMetadata.name &&
            tokenMetadata.name !== undefined) {
            console_1.default.log(chalk_1.default.yellow(`Name has changed for ${tokenId} from ${dbAsset.name} to ${tokenMetadata.name}`));
            assetOnly.name = tokenMetadata.name;
            isUpdate = true;
        }
        if (dbAsset.description !== tokenMetadata.description &&
            tokenMetadata.description !== undefined) {
            console_1.default.log(chalk_1.default.yellow(`Description has changed for ${tokenId}`));
            assetOnly.description = tokenMetadata.description;
            isUpdate = true;
        }
        if (dbAsset.image !== tokenMetadata.image &&
            tokenMetadata.image !== undefined) {
            console_1.default.log(chalk_1.default.yellow(`Image has changed for ${tokenId} from ${dbAsset.image} to ${tokenMetadata.image}`));
            assetOnly.image = tokenMetadata.image;
            isUpdate = true;
        }
        if (dbAsset.animation !== tokenMetadata.animation_url &&
            tokenMetadata.animation_url !== undefined) {
            console_1.default.log(chalk_1.default.yellow(`Animation has changed for ${tokenId} from ${dbAsset.animation} to ${tokenMetadata.animation_url}`));
            assetOnly.animation = tokenMetadata.animation_url;
            isUpdate = true;
        }
        if (isUpdate) {
            console_1.default.log(chalk_1.default.red(`PV::${new Date().toISOString()}:: Asset ${tokenId.toString()} has updates, updating...`));
            assetOnly.updatedDate = new Date();
            dbAsset = (yield (0, manager_1.updateAssets)(assetOnly))[0];
        }
        else {
            console_1.default.log(chalk_1.default.green(`PV::${new Date().toISOString()}:: Asset ${tokenId.toString()} has no updates`));
        }
        yield checkAndUpdateTraits(dbAsset, tokenMetadata);
    }
    else if (dbAsset && !tokenMetadata) {
        console_1.default.log(chalk_1.default.red(`PV::${new Date().toISOString()}:: Asset ${tokenId.toString()} exists in DB but not on blockchain, marking as burned...`));
        let burnedAsset = dbAsset;
        burnedAsset.status = 'burned';
        burnedAsset.updatedDate = new Date();
        yield database_1.dataSource
            .createQueryBuilder()
            .insert()
            .into('AssetEntity')
            .values(burnedAsset)
            .orUpdate(['status', 'updatedDate'], ['tokenId', 'contractId'], {
            skipUpdateIfNoValuesChanged: true,
        })
            .execute();
        yield database_1.dataSource.destroy();
    }
    return dbAsset;
});
const processOwner = (tokenId, Erc721Contract) => __awaiter(void 0, void 0, void 0, function* () {
    let blockchainOwnerAddress;
    try {
        blockchainOwnerAddress = yield Erc721Contract.getFunction('ownerOf')(tokenId);
    }
    catch (err) {
        console_1.default.log(chalk_1.default.red(`PV::${new Date().toISOString()}:: Error getting ownerOf for ${tokenId.toString()}`));
        blockchainOwnerAddress = '0x000000000000000000000000000000000000dEaD';
    }
    let dbOwner = (yield (0, manager_1.getOwnerByWalletAddress)(blockchainOwnerAddress));
    if (!dbOwner) {
        dbOwner = (yield (0, manager_1.add)(entity_1.OwnerEntity, {
            walletAddress: blockchainOwnerAddress,
        }))[0];
    }
    return { dbOwner };
});
const checkAndUpdateOwner = (erc721contract, asset) => __awaiter(void 0, void 0, void 0, function* () {
    let blockchainOwner = yield erc721contract.ownerOf(asset.tokenId);
    let owner = (yield (0, manager_1.getOne)(entity_1.OwnerEntity, asset.ownerId));
    if (!owner)
        owner = (yield (0, manager_1.add)(entity_1.OwnerEntity, {
            walletAddress: blockchainOwner,
        }))[0];
    let ownerId = owner ? owner.id : null;
    if (blockchainOwner.toLowerCase() !== asset.ownerId.toLowerCase()) {
        console_1.default.log(chalk_1.default.red(`Owner of asset in db for tokenId ${asset.tokenId} is ${owner.walletAddress} but on chain is ${blockchainOwner}`));
        let { attributes: omitted } = asset, assetOnly = __rest(asset, ["attributes"]);
        let updatedAsset = Object.assign(Object.assign({}, assetOnly), { ownerId: ownerId });
        yield (0, manager_1.update)(entity_1.AssetEntity, updatedAsset);
        return {
            id: asset.id,
            incorrectOwner: asset.ownerId,
            correctOwner: blockchainOwner,
            corrected: true,
        };
    }
    console_1.default.log(chalk_1.default.green(`Finished checking asset tokenId ${asset.tokenId}`));
    return null;
});
const checkAndUpdateTraits = (asset, metadata) => __awaiter(void 0, void 0, void 0, function* () {
    let dbas = asset.attributes;
    let blockchainAttributes = metadata.attributes;
    //let insertAttributes = [];
    let updateAttributesValues = [];
    if (!blockchainAttributes)
        return;
    for (let bca of blockchainAttributes) {
        let dba = null;
        if (dbas !== undefined) {
            dba = dbas.find((dba) => {
                return dba.traitType === bca.trait_type;
            });
        }
        if (!dba && bca.value !== null && bca.value !== undefined) {
            console_1.default.log(chalk_1.default.red(`PV::${new Date().toISOString()}:: Attribute ${bca.trait_type} does not exist for asset ${asset.tokenId}, adding...`));
            updateAttributesValues.push({
                assetId: asset.id,
                traitType: bca.trait_type,
                value: bca.value,
            });
        }
        else if (dba.value !== bca.value) {
            console_1.default.log(chalk_1.default.red(`PV::${new Date().toISOString()}:: Attribute ${bca.trait_type} has changed for asset ${asset.tokenId} on blockchain, updating...`));
            dba.value = bca.value;
            updateAttributesValues.push(dba);
        }
        else if (dba.value === null && bca.value !== null) {
            console_1.default.log(chalk_1.default.red(`PV::${new Date().toISOString()}:: Attribute ${bca.trait_type} is null for asset ${asset.tokenId} on blockchain, removing...`));
            yield (0, manager_1.remove)(entity_1.AttributeEntity, dba.id);
        }
    }
    /*if (insertAttributes.length > 0) {
        await updateAttributes(insertAttributes);
    }*/
    if (updateAttributesValues.length > 0) {
        yield (0, manager_1.updateAttributes)(updateAttributesValues);
    }
    /*    while (bcas.length > 0) {
        let tempbca = bcas.shift();
        let tempdba = dbas.filter((dba: AttributeEntity, i: number) => {
            if (dba.traitType === tempbca.trait_type) {
                return dbas.splice(i, 1);
            }
            return false;
        });
        if (!tempdba) {
            await add(AttributeEntity, {
                assetId: asset.id,
                traitType: tempbca.trait_type,
                value: tempbca.value,
            });
        } else if (tempdba[0].value !== tempbca.value) {
            let tempAttr = tempdba[0];
            tempAttr.value = tempbca.value;
            await update(AttributeEntity, {
                ...tempAttr,
            });
        }
    }
    if (dbas.length > 0) {
        for (let attr of dbas) {
            await remove(AttributeEntity, attr.id);
        }
    }*/
});
const isTransferEventDefinedInABI = (abi) => __awaiter(void 0, void 0, void 0, function* () {
    return abi.some((item) => {
        return item.type === 'event' && item.name === 'Transfer';
    });
});
exports.isTransferEventDefinedInABI = isTransferEventDefinedInABI;
