import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useHistoryContext } from "@/context/userHistoryContext";

const useSearch = () => {
  const { addSearchEntry } = useHistoryContext();
  const { user } = useAuthContext(); // Get the user context
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [genericSearchResult, setGenericSearchResult] = useState([]);
  const [trademarkSearchResult, setTrademarkSearchResult] = useState([]);
  const [judgementClassificationResult, setJudgementClassificationResult] = useState([]);

  const search = async (searchType, inputType, data, isfromHistory = false) => {
    setLoading(true); //! Start loading

    let query_data = {};

    try {
      if (searchType === "generic") {
        query_data = { text: data.text };
        const response = await axios.get("http://192.168.0.2:8000/search/genericsearch", {
          params: query_data,
        });
        setGenericSearchResult(response.data);
      } else if (searchType === "trademark") {
        if (inputType === "section") {
          query_data = { section_no: data.section, query_type: "section_no" };
        } else {
          query_data = { text: data.text, query_type: "text" };
        }
        const response = await axios.get("http://192.168.0.2:8000/search/trademarksearch", {
          params: query_data,
        });
        setTrademarkSearchResult(response.data);
      } else if (searchType === "judgement") {
        query_data = { text: data.text };
        const response = await axios.get("http://192.168.0.2:8000/search/judgementclassification", {
          params: query_data,
        });
        setJudgementClassificationResult(response.data);
      }

      if (user) {
        const searchEntry = {
          searchType,
          query_data,
          timestamp: new Date().toISOString(),
        };
        if (!isfromHistory) addSearchEntry(searchEntry);
      }
    } catch (error) {
      console.error(error); // Handle any errors that occurred during the request
    }

    setLoading(false); //! Stop loading
    setHasSearched(true); // Set hasSearched to true when a search is performed

    return {
      setGenericSearchResult,
      setJudgementClassificationResult,
      setTrademarkSearchResult,
      search,
      genericSearchResult,
      trademarkSearchResult,
      judgementClassificationResult,
      loading,
      hasSearched,
    };
  };

  return {
    setGenericSearchResult,
    setJudgementClassificationResult,
    setTrademarkSearchResult,
    search,
    genericSearchResult,
    trademarkSearchResult,
    judgementClassificationResult,
    loading,
    hasSearched,
  };
};

export default useSearch;
