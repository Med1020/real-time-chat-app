import Button from "@/components/UI/Button";
import { getFriendsByUserId } from "@/helpers/get-friends-by-userid";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { Message } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);
  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessage] = (await fetchRedis(
        "zrange",
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as Message[];
      return {
        ...friend,
        lastMessage,
      };
    })
  );
  return (
    <div className="container py-12">
      <h1></h1>
    </div>
  );
};

export default Dashboard;
