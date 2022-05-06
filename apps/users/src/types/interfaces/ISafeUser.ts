import { Post } from "@prisma/client";

export type ISafeUser = {
  id: string;
  username: string;
  displayname: string | null;
  flags: string[];
  email: string;
  // Remove for obv reasone
  //password: string;
  avatar: string | null;
  posts?: Post[];
  joined: Date;

  // Remove because no session access
  //sessions: string[];
};
