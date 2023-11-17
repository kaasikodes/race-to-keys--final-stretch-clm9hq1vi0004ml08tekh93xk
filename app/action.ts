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
  TAuthUserPrivateKeyResponse,
  TDBResponse,
  TGetUserAccountsResponse,
  TGetUserDataResponse,
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
  const dbUsers = await prisma.user.findMany();
  const users = await Promise.all(
    dbUsers.map(async (user) => await _isUserKeyInitialized(user.id))
  );
  const ownedCollectionsWithAvailableUsers = await Promise.all(
    ownedCollections.map(async (collection) => {
      const user = users.find(
        (user) =>
          new HexString(user.address).toShortString() ===
          new HexString(collection.address).toShortString()
      )?.user;
      if (!user) {
        return { ...collection, user: undefined };
      }
      return { ...collection, user };
    })
  );
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
        total: ownedCollectionsWithAvailableUsers.length,
        data: ownedCollectionsWithAvailableUsers.map((item) => ({
          collectionAddress: item.address,
          keysOwned: item.keys,
          user: item.user,
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
  return { isKeyInitialized, user, address, userId, dbUser };
}
export async function isUserKeyInitialized() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  const { isKeyInitialized, user, address } = await _isUserKeyInitialized(
    userId
  );
  return { isKeyInitialized, user, address, userId };
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
        userId: account?.id as string,
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

export async function getAuthUserPrivateKey() {
  try {
    const { user } = await isUserKeyInitialized();
    const response: TAuthUserPrivateKeyResponse = {
      message: "Your private key retrieved successfully!",
      success: true,
      data: {
        privateKey: user.privateKey,
      },
    };
    return response;
  } catch (error) {
    return {
      message: "Your private key retrieval failed!",
      success: false,
      data: null,
    };
  }
}
export async function getUserData(props: { userId: string }) {
  const { userId } = props;
  try {
    const { user, dbUser } = await _isUserKeyInitialized(userId);
    const response: TGetUserDataResponse = {
      message: "User data retrieved successfully!",
      success: true,
      data: {
        email: user.username,
        phone: dbUser?.phone,
        address: user.publicKey,
        imageSrc: dbUser?.image,
      },
    };
    return response;
  } catch (error) {
    return {
      message: "User data retrieval failed!",
      success: false,
      data: null,
    };
  }
}
export async function updateUserData(props: {
  email: string;
  phone: string;
  userId: string;
}) {
  const { email, phone, userId } = props;
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email,
        phone,
      },
    });

    return {
      message: "User data updated successfully!",
      success: true,
    };
  } catch (error) {
    return {
      message: "User data update failed!",
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
  const dbUsers = await prisma.user.findMany();
  const users = await Promise.all(
    dbUsers.map(async (user) => await _isUserKeyInitialized(user.id))
  );

  const { user } = await isUserKeyInitialized();
  const userKeySubjects = await getKeySubjects(user);
  const userKeySubjectsWithAvailableUsers = await Promise.all(
    userKeySubjects.map(async (collection) => {
      const user = users.find(
        (user) =>
          new HexString(user.address).toShortString() ===
          new HexString(collection.address).toShortString()
      )?.user;
      if (!user) {
        return { ...collection, user: undefined };
      }
      return { ...collection, user };
    })
  );

  const allKeySubjects = await getKeySubjects();
  const allKeySubjectsWithAvailableUsers = await Promise.all(
    allKeySubjects.map(async (collection) => {
      const user = users.find(
        (user) =>
          new HexString(user.address).toShortString() ===
          new HexString(collection.address).toShortString()
      )?.user;
      if (!user) {
        return { ...collection, user: undefined };
      }
      return { ...collection, user };
    })
  );
  const response: TKeySubjectResponse = {
    message: "Key subjects retrieved successfully!",
    success: true,
    data: {
      allKeySubjects: {
        data: allKeySubjectsWithAvailableUsers
          .map((item) => ({
            keys: item.keys,
            keySubjectAddress: item.address,
            user: item.user,
          }))
          .reverse(),
        total: allKeySubjectsWithAvailableUsers.length,
      },
      userKeySubjects: {
        data: userKeySubjectsWithAvailableUsers
          .map((item) => ({
            keys: item.keys,
            keySubjectAddress: item.address,
            user: item.user,
          }))
          .reverse(), //to ensure that the latest key subject is at the top
        total: userKeySubjectsWithAvailableUsers.length,
      },
    },
  };
  return response;
}
export async function getTradeHistoryData() {
  const dbUsers = await prisma.user.findMany();
  const users = await Promise.all(
    dbUsers.map(async (user) => await _isUserKeyInitialized(user.id))
  );

  const { address, user } = await isUserKeyInitialized();
  const tradeHistory = await getTradeHistory();
  const tradeHistoryWithAvailableUsers = await Promise.all(
    tradeHistory.map(async (history) => {
      const user = users.find(
        (user) =>
          new HexString(user.address).toShortString() ===
          new HexString(history.data.trader).toShortString()
      )?.user;
      if (!user) {
        return { ...history, user: undefined };
      }
      return { ...history, user };
    })
  );
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
        data: tradeHistoryWithAvailableUsers,
        total: tradeHistoryWithAvailableUsers.length,
      },
      userHistory: {
        data: userTradeHistory.map((item) => ({
          ...item,
          user,
        })),
        total: userTradeHistory.length,
      },
    },
  };
  return response;
}
