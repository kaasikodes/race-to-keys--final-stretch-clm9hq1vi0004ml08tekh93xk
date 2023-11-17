import { getUserAccounts } from "../action";
import AccountContainer from "../../components/modules/account/AccountContainer";

const Account = async () => {
  const response = await getUserAccounts();
  return (
    <div className="Container">
      <AccountContainer data={response.data} />
    </div>
  );
};

export default Account;
