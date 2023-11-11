import moment from "moment";
import React from "react";
import LiveClock from "../../LiveClock";
import Link from "next/link";
import PersonWelcomingIcon from "../../icons/PersonWelcomingIcon";
import { FaCalendar } from "react-icons/fa";
import Image from "next/image";
import Button from "../../ui/button";
import { InitializeKeyForm } from "./InitializeKeyForm";

const UserInfoDBCard: React.FC<{
  userName?: string | null;
  email?: string | null;
  phone?: string | null;
  publicKey?: string | null;
  accountBalance?: number | null;
  isKeyInitialized?: boolean;
}> = ({
  userName,
  publicKey,
  accountBalance,
  email,
  phone,
  isKeyInitialized,
}) => {
  return (
    <div className="bg-mainBg shadow border rounded-md px-5 pt-4 pb-6">
      <h5 className="font-semibold text-accent text-lg">Welcome {userName}</h5>
      <div className="flex items-center gap-3 mt-3">
        <span className="flex items-center gap-2 text-xs text-accent">
          <FaCalendar />
          <span>{moment().format("DD MMMM YYYY")}</span>
        </span>
        <span className="flex items-center gap-2 text-xs text-green-700">
          <i className="ri-time-line"></i>
          <span>
            <LiveClock format="hh:mm:ss A" />
            {/* TODO: When 12 hr global format is implemented from company setting ensure to apply it to the format above */}
          </span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
        <div>
          <ul className="flex flex-col gap-2 text-xs text-accent">
            <li>Address: {publicKey}</li>
            <li>Account Balance:{accountBalance}</li>

            <li>Email: {email}</li>
            <li>Phone: {phone}</li>
          </ul>

          <div className="mt-6 pb-2 flex gap-4">
            <Button>View Profile</Button>
            {isKeyInitialized === false && <InitializeKeyForm />}
          </div>
        </div>
        <div className="flex justify-end">
          <Image
            src={`/assets/person-welcome.svg`}
            alt="welcome-person"
            width={120}
            height={120}
            className="md:-mt-16 w-3/4"
          />
          {/* <PersonWelcomingIcon className="md:-mt-32 w-full" /> */}
        </div>
        {/* <div className="">
  <img
    src="https://res.cloudinary.com/ddvaelej7/image/upload/v1667472471/welcome1_yu9jto.svg"
    alt="employee"
    className="md:-mt-16"
  />
</div> */}
      </div>
    </div>
  );
};

export default UserInfoDBCard;
