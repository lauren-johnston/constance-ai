// pages/index.tsx
import type { NextPage } from "next";
import Chatbot from "src/components/chatbot";
import "tailwindcss/tailwind.css";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-black-100">
      <Chatbot />
    </div>
  );
};

export default Home;
