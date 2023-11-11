"use client";

import { useSecureAptosAccount } from "@/app/hooks";
import { SecurePrivateKeyForm } from "../../SecurePrivateKeyForm";

const AccountCreator = () => {
  const { secureAptosAccount } = useSecureAptosAccount();
  return (
    <div>
      <SecurePrivateKeyForm
        onSubmit={async ({ accessCode, catchPhrases }) => {
          try {
            const response = await secureAptosAccount({
              data: { accessCode, catchPhrases },
            });
            console.log(response);
          } catch (error) {
            console.log(error);
          }
        }}
      />
    </div>
  );
};

export default AccountCreator;
