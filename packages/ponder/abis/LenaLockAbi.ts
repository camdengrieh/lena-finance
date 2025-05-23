export const LenaLockAbi = [
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_autoCollectAddress",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "_lpFeeReceiver",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "_collectFeeReceiver",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "nameHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lpFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collectFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "flatFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "flatFeeToken",
        type: "address",
      },
    ],
    name: "onAddFee",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lockId",
        type: "uint256",
      },
    ],
    name: "onDecreaseLiquidity",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "nameHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lpFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collectFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "flatFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "flatFeeToken",
        type: "address",
      },
    ],
    name: "onEditFee",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lockId",
        type: "uint256",
      },
    ],
    name: "onIncreaseLiquidity",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lock_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "nftPositionManager",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nft_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "additionalCollector",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "collectAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "unlockDate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collectFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "poolAddress",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint96",
            name: "nonce",
            type: "uint96",
          },
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "address",
            name: "token0",
            type: "address",
          },
          {
            internalType: "address",
            name: "token1",
            type: "address",
          },
          {
            internalType: "uint24",
            name: "fee",
            type: "uint24",
          },
          {
            internalType: "int24",
            name: "tickLower",
            type: "int24",
          },
          {
            internalType: "int24",
            name: "tickUpper",
            type: "int24",
          },
          {
            internalType: "uint128",
            name: "liquidity",
            type: "uint128",
          },
          {
            internalType: "uint256",
            name: "feeGrowthInside0LastX128",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "feeGrowthInside1LastX128",
            type: "uint256",
          },
          {
            internalType: "uint128",
            name: "tokensOwed0",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "tokensOwed1",
            type: "uint128",
          },
        ],
        indexed: false,
        internalType: "struct INonfungiblePositionManager.Position",
        name: "position",
        type: "tuple",
      },
    ],
    name: "onLock",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lockId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "currentOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "pendingOwner",
        type: "address",
      },
    ],
    name: "onLockOwnershipTransferStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lockId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "unlockDate",
        type: "uint256",
      },
    ],
    name: "onRelock",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "nameHash",
        type: "bytes32",
      },
    ],
    name: "onRemoveFee",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lockId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "additionalCollector",
        type: "address",
      },
    ],
    name: "onSetAdditionalCollector",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lockId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "collectAddress",
        type: "address",
      },
    ],
    name: "onSetCollectAddress",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "migrator",
        type: "address",
      },
    ],
    name: "onSetMigrator",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lockId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ucf",
        type: "uint256",
      },
    ],
    name: "onSetUCF",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lockId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "oldOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "onTransferLockOwnership",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lock_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "onWithdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "AUTO_COLLECT_ACCOUNT",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ETERNAL_LOCK",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "FEE_ADDR_COLLECT",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "FEE_ADDR_LP",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "FEE_DENOMINATOR",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "FEE_RESOLVER",
    outputs: [
      {
        internalType: "contract IFeeResolver",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "LOCKS",
    outputs: [
      {
        internalType: "uint256",
        name: "lock_id",
        type: "uint256",
      },
      {
        internalType: "contract INonfungiblePositionManager",
        name: "nftPositionManager",
        type: "address",
      },
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "nft_id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "pendingOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "additionalCollector",
        type: "address",
      },
      {
        internalType: "address",
        name: "collectAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "unlockDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "ucf",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NONCE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_lockId",
        type: "uint256",
      },
    ],
    name: "acceptLockOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_lpFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_collectFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_flatFee",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_flatFeeToken",
        type: "address",
      },
    ],
    name: "addOrEditFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "adminRefundERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address payable",
        name: "_receiver",
        type: "address",
      },
    ],
    name: "adminRefundEth",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_lockId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "uint128",
        name: "_amount0Max",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "_amount1Max",
        type: "uint128",
      },
    ],
    name: "collect",
    outputs: [
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "fee0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "fee1",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_lockId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint128",
            name: "liquidity",
            type: "uint128",
          },
          {
            internalType: "uint256",
            name: "amount0Min",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount1Min",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
        ],
        internalType:
          "struct INonfungiblePositionManager.DecreaseLiquidityParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "decreaseLiquidity",
    outputs: [
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int24",
        name: "currentTick",
        type: "int24",
      },
      {
        internalType: "int24",
        name: "tickLower",
        type: "int24",
      },
      {
        internalType: "int24",
        name: "tickHigher",
        type: "int24",
      },
      {
        internalType: "uint128",
        name: "liquidity",
        type: "uint128",
      },
    ],
    name: "getAmountsForLiquidity",
    outputs: [
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "getFee",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "lpFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collectFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "flatFee",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "flatFeeToken",
            type: "address",
          },
        ],
        internalType: "struct ILenaLock.FeeStruct",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "getFeeOptionAtIndex",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "lpFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collectFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "flatFee",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "flatFeeToken",
            type: "address",
          },
        ],
        internalType: "struct ILenaLock.FeeStruct",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getFeeOptionLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_lockId",
        type: "uint256",
      },
    ],
    name: "getLock",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "lock_id",
            type: "uint256",
          },
          {
            internalType: "contract INonfungiblePositionManager",
            name: "nftPositionManager",
            type: "address",
          },
          {
            internalType: "address",
            name: "pool",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nft_id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "pendingOwner",
            type: "address",
          },
          {
            internalType: "address",
            name: "additionalCollector",
            type: "address",
          },
          {
            internalType: "address",
            name: "collectAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "unlockDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ucf",
            type: "uint256",
          },
        ],
        internalType: "struct ILenaLock.Lock",
        name: "_lock",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLocksLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getNumUserLocks",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "getUserLockAtIndex",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "lock_id",
            type: "uint256",
          },
          {
            internalType: "contract INonfungiblePositionManager",
            name: "nftPositionManager",
            type: "address",
          },
          {
            internalType: "address",
            name: "pool",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nft_id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "pendingOwner",
            type: "address",
          },
          {
            internalType: "address",
            name: "additionalCollector",
            type: "address",
          },
          {
            internalType: "address",
            name: "collectAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "unlockDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ucf",
            type: "uint256",
          },
        ],
        internalType: "struct ILenaLock.Lock",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_lockId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount0Desired",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount1Desired",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount0Min",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount1Min",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
        ],
        internalType:
          "struct INonfungiblePositionManager.IncreaseLiquidityParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "increaseLiquidity",
    outputs: [
      {
        internalType: "uint128",
        name: "liquidity",
        type: "uint128",
      },
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "contract INonfungiblePositionManager",
            name: "nftPositionManager",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nft_id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "dustRecipient",
            type: "address",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "additionalCollector",
            type: "address",
          },
          {
            internalType: "address",
            name: "collectAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "unlockDate",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "feeName",
            type: "string",
          },
          {
            internalType: "bytes[]",
            name: "r",
            type: "bytes[]",
          },
        ],
        internalType: "struct ILenaLock.LockParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "lock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "contract INonfungiblePositionManager",
            name: "nftPositionManager",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nft_id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "dustRecipient",
            type: "address",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "additionalCollector",
            type: "address",
          },
          {
            internalType: "address",
            name: "collectAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "unlockDate",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "feeName",
            type: "string",
          },
          {
            internalType: "bytes[]",
            name: "r",
            type: "bytes[]",
          },
        ],
        internalType: "struct ILenaLock.LockParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "lockAndConvert",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_lockId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_unlockDate",
        type: "uint256",
      },
    ],
    name: "relock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "removeFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_lockId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_additionalCollector",
        type: "address",
      },
    ],
    name: "setAdditionalCollector",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_lockId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_collectAddress",
        type: "address",
      },
    ],
    name: "setCollectAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_autoCollectAccount",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "_lpFeeReceiver",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "_collectFeeReceiver",
        type: "address",
      },
    ],
    name: "setFeeParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IFeeResolver",
        name: "_resolver",
        type: "address",
      },
    ],
    name: "setFeeResolver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_lockId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_ucf",
        type: "uint256",
      },
    ],
    name: "setUCF",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int24",
        name: "tickSpacing",
        type: "int24",
      },
    ],
    name: "tickSpacingToMaxTick",
    outputs: [
      {
        internalType: "int24",
        name: "maxTick",
        type: "int24",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_lockId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "transferLockOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_lockId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
