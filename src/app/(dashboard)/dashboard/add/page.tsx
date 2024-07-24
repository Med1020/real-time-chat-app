import AddFriendBtn from "@/components/AddFriendBtn";
import { FC } from "react";

const page: FC = ({}) => {
  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <AddFriendBtn />
    </main>
  );
};

export default page;
