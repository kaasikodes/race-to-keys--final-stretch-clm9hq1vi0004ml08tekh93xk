import { Button, Table } from "antd";
import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col gap-4 px-4 py-2">
      <div>
        <Button type="primary" className="bg-blue-500">
          Hell0
        </Button>
      </div>
      <Table />
    </div>
  );
};

export default Home;
