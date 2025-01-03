import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./App.css";
import axios from "axios";

const POSTS = [
    { id: 1, title: "Post 1" },
    { id: 2, title: "Post 2" },
];

function App() {
    const queryClient = useQueryClient();
    // * chiamata api con axios, res tramite queryFn,
    // * questa query ha una chiave univoca
    const postsQuery = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            return await wait(1000).then(async () => {
                const response = await axios.get("http://localhost:3000/posts");
                return response.data;
            });
        },
    });

    const newPostMutation = useMutation({
        mutationFn: async (title) => {
            const response = await axios.post("http://localhost:3000/posts", {
                title,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]);
        },
    });
    // * stati della query
    if (postsQuery.isLoading) return <h1>Loading...</h1>;
    if (postsQuery.isError) {
        return <pre>{JSON.stringify(postsQuery.error.message)}</pre>;
    }

    return (
        <>
            <h1>TanStack Query</h1>
            {postsQuery.data.map((post) => (
                <div key={post.id}>{post.title}</div>
            ))}
            <button
                className="p-2 bg-green-300 rounded-md"
                onClick={() => newPostMutation.mutate("ciao")}
            >
                {postsQuery.isFetching ? "Loading..." : "Add New"}
            </button>
        </>
    );
}

function wait(duration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
}

export default App;
