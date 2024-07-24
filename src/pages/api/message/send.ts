import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { nanoid } from "nanoid";
import { Message, messageValidator } from "@/lib/validations/message";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { input, chatId }: { input: string; chatId: string } = await req.body;
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).send("Unauthorized");
    }
    const [userId1, userId2] = chatId.split("--");

    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return res.status(401).send("Unauthorized");
    }
    const friendId = session.user.id === userId1 ? userId2 : userId1;

    const friendList = (await fetchRedis(
      "smembers",
      `user:${session.user.id}:friends`
    )) as string[];
    const isFriend = friendList.includes(friendId);

    if (!isFriend) {
      return res.status(401).send("Unauthorized");
    }

    const rawSender = (await fetchRedis(
      "get",
      `user:${session.user.id}`
    )) as string;
    const sender = JSON.parse(rawSender) as User;

    const timeStamp = Date.now();

    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text: input,
      timeStamp,
    };

    console.log(messageData);
    const message = messageValidator.parse(messageData);
    //all checked, send the message
    await db.zadd(`chat:${chatId}:messages`, {
      score: timeStamp,
      member: JSON.stringify(message),
    });
    return res.send("ok");
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).send(error.message);
    }
    return new Response("Internal server Error", { status: 500 });
  }
};

export default handler;
