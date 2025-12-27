import { useState } from "react";
import { getAIRecommendations } from "../services/api";
import Loader from "./Loader";

const AIChatBox = ({ onRecommend }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (!query.trim()) return;

    onRecommend([]); // clear old results

    try {
      setLoading(true);
      const data = await getAIRecommendations(query);
      onRecommend(data);
    } catch (error) {
      alert("AI service failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-4 mt-6">
      <input
        className="w-full border p-2 rounded"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="laptop under 50000"
      />
      <button
        onClick={handleAskAI}
        className="bg-black text-white px-4 py-2 rounded mt-3"
      >
        Ask AI
      </button>
      {loading && <Loader />}
    </div>
  );
};

export default AIChatBox; // ✅ THIS LINE IS CRITICAL


