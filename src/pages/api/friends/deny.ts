import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z, ZodError } from "zod";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).send("Unauthorized");
    }

    const { id: idToDeny } = z.object({ id: z.string() }).parse(body);
    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny);
    return res.send("");
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      return res.status(422).send("Invalid request payload");
    }
    return res.status(400).send("Invalid request");
  }
};

export default handler;
