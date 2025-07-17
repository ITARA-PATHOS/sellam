import { useEffect, useState } from 'react';
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const useConversations = (page = 1, perPage = 20) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConversations = async () => {
      const token = await getAccessToken();
      const user = JSON.parse(sessionStorage.getItem('user'));

      if (!token || !user) {
        setLoading(false);
        setError("Unauthorized: Please log in.");
        return;
      }

      try {
        console.log("➡️ convo fetch, token valid?", !!token);
        console.log("➡️ convo fetch, user info:", user);

        const response = await fetch(`${BASE_URL}/v1/conversations?page=${page}&per_page=${perPage}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          setConversations(data.data || []);
        } else {
          setError(data.message || "Failed to load conversations.");
        }
      } catch (err) {
        setError(err.message || "Network error.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [page, perPage]);

  return { conversations, loading, error };
};

export default useConversations;
