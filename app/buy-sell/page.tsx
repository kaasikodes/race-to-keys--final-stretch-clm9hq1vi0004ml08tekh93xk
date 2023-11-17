import { getKeySubjectsData } from "../action";
import BuyOrSellContainer from "../../components/modules/buy-sell/BuyOrSellContainer";

const Sell = async () => {
  const data = await getKeySubjectsData();
  return (
    <div className="Container">
      <BuyOrSellContainer data={data.data.userKeySubjects} />
    </div>
  );
};

export default Sell;
