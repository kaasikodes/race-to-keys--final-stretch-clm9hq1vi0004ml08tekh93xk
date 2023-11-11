"use server";

import { prisma } from "@/config/database";
import {
  getProtocolFeePercentage,
  getSubjectFeePercentage,
  getAptosBalance,
  getOwnedCollections,
  getTradeHistory,
  buyKeys,
  getKeySubjects,
  getBuyPrice,
  getSellPrice,
  getBuyPriceAfterFees,
  getSellPriceAfterFees,
  getKeyHolders,
  getKeyBalance,
  getKeySupply,
  sellKeys,
} from "@/lib/contract";
import {
  TDBResponse,
  TGetUserAccountsResponse,
  THistoryResponse,
  TKeySubjectDetailsResponse,
  TKeySubjectResponse,
  User,
} from "@/lib/types";
import { decrypt, createAptosAccount } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { HexString } from "aptos";

export async function getUserDBData() {
  const session = await getServerSession(authOptions);
  const protocolFeePercentage = await getProtocolFeePercentage();
  const subjectFeePercentage = await getSubjectFeePercentage();
  const dbPrivateKey = await prisma.privateKey.findFirst({
    where: {
      userId: session?.user.id,
    },
  });

  const privateKeyDecrypted = decrypt(
    dbPrivateKey?.value_via_password as unknown as string
  );
  const aptosAcccount = createAptosAccount(privateKeyDecrypted);
  const publicKey = aptosAcccount.pubKey().toString();
  const address = aptosAcccount.address().toString();
  const user: User = {
    username: session?.user.name as string,
    name: session?.user.name as string,
    followers: 0,
    following: 0,
    imgSrc: session?.user.image as string,
    publicKey: address, //TODO: consider using public key instead
    privateKey: privateKeyDecrypted,
  };
  const accountBalance = await getAptosBalance(address);
  const ownedCollections = await getOwnedCollections(user);
  const tradeHistory = await getTradeHistory();
  const userTradeHistory = tradeHistory.filter(
    (item) =>
      new HexString(item.data.trader).toShortString() ===
      new HexString(address).toShortString()
  );

  // console.log("Trade History", tradeHistory.slice(0, 5), address);
  const { isKeyInitialized } = await isUserKeyInitialized();
  const response: TDBResponse = {
    message: "Dashboard data retrieved successfully",
    success: true,
    data: {
      fees: {
        protocolFeePercentage,
        subjectFeePercentage,
      },
      ownedCollections: {
        total: ownedCollections.length,
        data: ownedCollections.map((item) => ({
          collectionAddress: item.address,
          keysOwned: item.keys,
        })),
      },
      recentTradeHistory: {
        total: userTradeHistory.length,
        data: userTradeHistory.slice(0, 10), //first 9 most recent trades by user
      },
      userInfo: {
        accountBalance,
        address,
        email: session?.user.email as string,
        isKeyInitialized,
      },
    },
  };
  return response;
}

async function _isUserKeyInitialized(userId?: string) {
  const dbUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  const dbPrivateKey = await prisma.privateKey.findFirst({
    where: {
      userId,
    },
  });
  const privateKeyDecrypted = decrypt(
    dbPrivateKey?.value_via_password as unknown as string
  );
  const aptosAcccount = createAptosAccount(privateKeyDecrypted);
  const address = aptosAcccount.address().toString();

  const user: User = {
    username: dbUser?.name as string,
    name: dbUser?.name as string,
    followers: 0,
    following: 0,
    imgSrc: dbUser?.image as string,
    publicKey: address, //TODO: consider using public key instead
    privateKey: privateKeyDecrypted,
  };
  const ownedCollections = await getOwnedCollections(user);
  const isKeyInitialized = ownedCollections.some(
    (item) =>
      new HexString(item.address).toShortString() ===
        new HexString(address).toShortString() && item.keys > 0
  );
  console.log(isKeyInitialized, "KEY HERW");
  return { isKeyInitialized, user, address };
}
export async function isUserKeyInitialized() {
  const session = await getServerSession(authOptions);
  const { isKeyInitialized, user, address } = await _isUserKeyInitialized(
    session?.user.id
  );
  return { isKeyInitialized, user, address };
}

export async function initializeUserKey() {
  const { user, isKeyInitialized, address } = await isUserKeyInitialized();
  try {
    if (isKeyInitialized) {
      return {
        message: "Key already initialized",
        success: false,
      };
    }
    await buyKeys(user, address, 1);
    return {
      message: "Key initialized successfully!",
      success: true,
    };
  } catch (error) {
    return {
      message: "Key initialization failed!",
      success: false,
    };
  }
}
export async function getUserAccounts(props: { search?: string } = {}) {
  const { search } = props;
  const accounts = await prisma.user.findMany();
  const promises = [];
  for (const account of accounts) {
    const promise = async () => {
      const { isKeyInitialized, address, user } = await _isUserKeyInitialized(
        account?.id
      );
      const accountKeySubjectDetails = await getKeySubjectDetails({
        keySubjectAddress: address,
      });
      const response: TGetUserAccountsResponse["data"]["data"][0] = {
        address,
        user,
        isKeyInitialized,
        ...accountKeySubjectDetails.data,
      };
      return response;
    };

    promises.push(promise());
  }
  const results = await Promise.all([...promises]);
  const response: TGetUserAccountsResponse = {
    message: "Accounts retrieved successfully",
    data: {
      data: results,
      total: results.length,
    },
    success: true,
  };
  return response;
}
export async function getKeySubjectDetails(props: {
  buyAmount?: number;
  sellAmount?: number;
  keySubjectAddress: string;
}) {
  const { keySubjectAddress, buyAmount, sellAmount } = props;
  const { address } = await isUserKeyInitialized();
  const buyPrice = buyAmount
    ? await getBuyPrice(keySubjectAddress, buyAmount)
    : undefined;
  const sellPrice = sellAmount
    ? await getSellPrice(keySubjectAddress, sellAmount)
    : undefined;
  const buyPriceAfterFees = buyAmount
    ? await getBuyPriceAfterFees(keySubjectAddress, buyAmount)
    : undefined;
  const sellPriceAfterFees = sellAmount
    ? await getSellPriceAfterFees(keySubjectAddress, sellAmount)
    : undefined;
  const keyHolders = await getKeyHolders(keySubjectAddress);
  const userKeyBalance = await getKeyBalance(keySubjectAddress, address);
  const keySupply = await getKeySupply(keySubjectAddress);
  const response: TKeySubjectDetailsResponse = {
    message: "Key subject details retrieved successfully!",
    success: true,
    data: {
      price: {
        buyPrice,
        sellPrice,
        buyPriceAfterFees,
        sellPriceAfterFees,
      },
      keyHolders: {
        data: keyHolders.map((item) => ({
          holderAddress: item.address,
          keys: item.keys,
        })),
        total: keyHolders.length,
      },
      userKeyBalance,
      keySupply,
    },
  };
  return response;
}
export async function userSellKeys(props: {
  amount: number;
  keySubjectAddress: string;
}) {
  const { amount, keySubjectAddress } = props;
  const { user } = await isUserKeyInitialized();
  try {
    await sellKeys(user, keySubjectAddress, amount);

    return {
      message: "Keys sold successfully!",
      success: true,
    };
  } catch (error) {
    return {
      message: "Key acquisition failed!",
      success: false,
    };
  }
}
export async function userBuyKeys(props: {
  amount: number;
  keySubjectAddress: string;
}) {
  const { amount, keySubjectAddress } = props;
  const { user } = await isUserKeyInitialized();
  try {
    await buyKeys(user, keySubjectAddress, amount);

    return {
      message: "Keys purchased successfully!",
      success: true,
    };
  } catch (error) {
    return {
      message: "Key purchase failed!",
      success: false,
    };
  }
}
export async function getKeySubjectsData() {
  const { user } = await isUserKeyInitialized();
  const userKeySubjects = await getKeySubjects(user);
  const allKeySubjects = await getKeySubjects();
  const response: TKeySubjectResponse = {
    message: "Key subjects retrieved successfully!",
    success: true,
    data: {
      allKeySubjects: {
        data: allKeySubjects.map((item) => ({
          keys: item.keys,
          keySubjectAddress: item.address,
        })),
        total: allKeySubjects.length,
      },
      userKeySubjects: {
        data: userKeySubjects.map((item) => ({
          keys: item.keys,
          keySubjectAddress: item.address,
        })),
        total: userKeySubjects.length,
      },
    },
  };
  return response;
}
export async function getTradeHistoryData() {
  const { address } = await isUserKeyInitialized();
  const tradeHistory = await getTradeHistory();
  const userTradeHistory = tradeHistory.filter(
    (item) =>
      new HexString(item.data.trader).toShortString() ===
      new HexString(address).toShortString()
  );
  const response: THistoryResponse = {
    message: "Trade history retrieved successfully",
    success: true,
    data: {
      allHistory: {
        data: tradeHistory,
        total: tradeHistory.length,
      },
      userHistory: {
        data: userTradeHistory,
        total: userTradeHistory.length,
      },
    },
  };
  return response;
}