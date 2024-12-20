import { Post } from "./post";
import { SocialProfile } from "./social-profile";

export interface Thread {
  id: string;
  title: string;
  description?: string;
  authorProfile: SocialProfile;
  posts: Post[];
  pinnedPosts: Post[];
  createdAt: string;
  updatedAt: string;
}
