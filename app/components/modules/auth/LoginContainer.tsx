"use client";

import { useSession, signIn } from "next-auth/react";
import React from "react";
import Button from "../../ui/button";
import { FaTwitter } from "react-icons/fa";

const LoginContainer = () => {
  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center text-white text-center -mt-20">
      <h4 className="text-2xl font-bold">Welcome to Sofii</h4>
      <p className="text-lg w-2/4">
        {` "Unlock the Future of Social Interaction: Join Our Decentralized
        Network, Where You Control Your Digital Experience."`}
      </p>
      <Button
        className="bg-white text-blue-500"
        type="primary"
        icon={<FaTwitter />}
        onClick={() => signIn("twitter")}
      >
        Login
      </Button>
    </div>
  );
};

export default LoginContainer;
