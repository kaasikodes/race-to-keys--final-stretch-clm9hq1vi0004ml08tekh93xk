import { z } from "zod";
import { secureAptosAccountSchema } from "./validation-schema";

export type SecurePrivateKeyProps = z.infer<typeof secureAptosAccountSchema> & {
  catchPhrases: string[];
};

export type UserInfo = {
  username: string;
  name: string;
  imgSrc?: string;
  followers?: number;
  following?: number;
};

export type User = UserInfo & {
  publicKey: string;
  privateKey: string;
};

export type ContractTradeEvent = {
  version: number;
  guid: {
    creation_number: number;
    account_address: string;
  };
  sequence_number: number;
  type: string;
  data: {
    is_buy: boolean;
    new_supply: number;
    protocol_fee_apt_amount: number;
    purchase_apt_amount: number;
    key_amount: number;
    subject: string;
    subject_fee_apt_amount: number;
    trader: string;
  };
};

export type ContractGetOwnedCollectionsResponse = [string[], number[]];

export type ContractGetCollectionsResponse = [string[], number[]];

export type ContractGetHoldersResponse = [string[], number[]];

export type TOwnedCollection = { collectionAddress: string; keysOwned: number };

export type TKeySubjectResponse = {
  message: string;
  success: boolean;

  data: {
    allKeySubjects: {
      data: ({
        keySubjectAddress: string;
        keys: number;
      } & { user?: User })[];
      total: number;
    };
    userKeySubjects: {
      data: ({
        keySubjectAddress: string;
        keys: number;
      } & { user?: User })[];
      total: number;
    };
  };
};
export type TGetUserAccountsResponse = {
  message: string;
  success: boolean;
  data: {
    data: (TKeySubjectDetailsResponse["data"] & {
      address: string;
      user: User;
      isKeyInitialized: boolean;
    } & { userId: string })[];
    total: number;
  };
};
export type TGetUserDataResponse = {
  message: string;
  success: boolean;
  data: Partial<{
    email: string | null;
    phone: string | null;
    address: string | null;
    imageSrc: string | null;
  }>;
};
export type TAuthUserPrivateKeyResponse = {
  message: string;
  success: boolean;
  data: {
    privateKey: string;
  };
};
export type TKeySubjectDetailsResponse = {
  message: string;
  success: boolean;
  data: {
    price: {
      buyPrice?: number;
      sellPrice?: number;
      buyPriceAfterFees?: number;
      sellPriceAfterFees?: number;
    };
    userKeyBalance: number;
    keySupply: number;
    keyHolders: {
      data: {
        holderAddress: string;
        keys: number;
      }[];
      total: number;
    };
  };
};

export type THistoryResponse = {
  message: string;
  success: boolean;
  data: {
    userHistory: {
      total: number;
      data: (ContractTradeEvent & { user?: User })[];
    };
    allHistory: {
      total: number;
      data: (ContractTradeEvent & { user?: User })[];
    };
  };
};
export type TDBResponse = {
  message: string;
  success: boolean;
  data: {
    userInfo: {
      address: string;
      accountBalance: number;
      email: string;
      isKeyInitialized: boolean;
    };
    fees: {
      protocolFeePercentage: number;
      subjectFeePercentage: number;
    };
    recentTradeHistory: {
      total: number;
      data: ContractTradeEvent[];
    };
    ownedCollections: {
      total: number;
      data: (TOwnedCollection & { user?: User })[];
    };
  };
};

export type IModalProps = {
  open: boolean;
  onClose: () => void;
};
