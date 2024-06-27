import Button from "@/components/UI/Button";
import React, { FC } from "react";

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = () => {
  return <Button intent="ghost">hello world</Button>;
};

export default Dashboard;
