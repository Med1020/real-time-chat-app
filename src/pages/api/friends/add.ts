import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/addFriend";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`
    )) as string;

    if (!idToAdd) {
      return res.status(400).send("This user does not exist");
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).send("Unauthorized");
    }
    if (idToAdd === session.user.id) {
      return res.status(400).send("You cannot add yourself as a friend");
    }

    //check if user is already added
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;
    if (isAlreadyAdded) {
      return res.status(400).send("Already added this user");
    }

    //check if user is already a friend
    const isAlreadyFriends = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;
    if (isAlreadyFriends) {
      return res.status(400).send("Already friends with this user");
    }

    //valid friend request
    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      "incoming_friend_requests",
      {
        senderId: session.user.id,
        senderEmail: session.user.email,
      }
    );

    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    return res.send("");
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).send("Invalid request payload");
    }
    return res.status(400).send("Invalid request");
  }
};

export default handler;
