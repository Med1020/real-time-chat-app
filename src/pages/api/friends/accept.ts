import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).send("Unauthorized");
    }
    //verify if users are already friends
    const isAlreadyFriends = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;
    if (isAlreadyFriends) {
      return res.status(400).send("Already friends");
    }

    const hasFriendRequest = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    )) as 0 | 1;

    if (!hasFriendRequest) {
      return res.status(400).send("No friend request");
    }

    db.sadd(`user:${session.user.id}:friends`, idToAdd);
    db.sadd(`user:${idToAdd}:friends`, session.user.id);

    db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);
    return res.status(200).send("");
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(422).send("Invalid request payload");
    }
    return res.status(400).send("Invalid request");
  }
};

export default handler;
