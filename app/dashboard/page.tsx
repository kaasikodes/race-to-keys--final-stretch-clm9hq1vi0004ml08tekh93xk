import { getUserDBData } from "../action";
import DBContainer from "../../components/modules/dashboard/DBContainer";

const Dashboard = async () => {
  const data = await getUserDBData();
  return (
    <div className="Container">
      <DBContainer data={data} />
    </div>
  );
};

export default Dashboard;
