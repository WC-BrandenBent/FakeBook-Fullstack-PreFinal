import AllPosts from "../components/posts/AllPosts";
import CreatePost from "../components/posts/CreatePost";
import { useEffect, useState } from "react";
import { apiRequest, fetchAllPosts } from "../api/api";

function Home() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const response = await fetchAllPosts();
    setPosts(response);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = () => {
    fetchPosts(); // Refresh the posts when a new post is created
    return (
      <>
        <AllPosts></AllPosts>
        <CreatePost onPostCreated={handlePostCreated}></CreatePost>
      </>
    );
  };
}
export default Home;
