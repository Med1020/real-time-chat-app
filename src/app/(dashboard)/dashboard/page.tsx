import Button from "@/components/UI/Button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  return <pre>Dashboard</pre>;
};

export default Dashboard;
