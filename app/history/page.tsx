import { getTradeHistoryData } from "../action";
import HistoryContainer from "../../components/modules/history/HistoryContainer";

const History = async () => {
  const data = await getTradeHistoryData();
  return (
    <div className="Container">
      <HistoryContainer data={data} />
    </div>
  );
};

export default History;
