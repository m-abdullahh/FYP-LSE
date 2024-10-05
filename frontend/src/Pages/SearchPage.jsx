import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import TextSearchInput from "@/customcomponents/TextSearchInput";
import ResultCard from "@/customcomponents/ResultCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useHistoryContext } from "@/context/userHistoryContext";
//! TEXT SCHEMA
const textSchema = z
  .object({
    text: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .optional(),
    section: z
      .string()
      .optional()
      .nullable()
      .refine((val) => val === null || !Number.isNaN(val), {
        message: "Expected a valid number",
      }),
  })
  .refine((data) => data.text || data.section, {
    message: "Either text or section must be provided",
  });

const SearchPage = () => {
  const { addSearchEntry } = useHistoryContext();
  const { user } = useAuthContext(); // Get the user context
  const [searchType, setSearchType] = useState("generic");
  const [inputType, setInputType] = useState("text");
  const [loading, setLoading] = useState(false); //! Loading state
  const [hasSearched, setHasSearched] = useState(false);
  const [genericSearchResult, setGenericSearchResult] = useState([]);
  const [trademarkSearchResult, setTrademarkSearchResult] = useState([]);
  const [judgementClassificationResult, setJudgementClassificationResult] = useState([]);

  const handleSearchType = (type) => {
    form.reset();
    setGenericSearchResult([]);
    setJudgementClassificationResult([]);
    setTrademarkSearchResult([]);
    setSearchType(type);
  };

  //! Form State
  const form = useForm({
    resolver: zodResolver(textSchema),
    defaultValues: { text: "", section: "" },
  });

  //! ON SUBMIT

  const onSubmit = async (data) => {
    setLoading(true); //! Start loading

    var query_data = {};

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
        addSearchEntry(searchEntry);
      }
    } catch (error) {
      console.error(error); // Handle any errors that occurred during the request
    }

    setLoading(false); //! Stop loading
    setHasSearched(true); // Set hasSearched to true when a search is performed
  };

  return (
    <div className="flex flex-col min-h-screen mx-2">
      <h1 className="mt-6 mb-4 font-extrabold text-3xl text-center">Legal Search Engine</h1>
      <main className="flex justify-center">
        <SearchTypeRadio {...{ searchType, handleSearchType }} />
      </main>
      <section className="mx-2">
        {searchType === "generic" && <TextSearchInput {...{ form, onSubmit, searchType }} />}
        {searchType === "trademark" && (
          <TrademarkSearch
            {...{ form, onSubmit, inputType, setInputType, searchType }}
            placeholder={inputType == "section" ? "Enter Section No." : "Enter Text"}
          />
        )}
        {searchType === "judgement" && <TextSearchInput {...{ form, onSubmit, searchType }} />}
      </section>
      {hasSearched && (
        <Badge variant="outline" className="text-muted-foreground text-sm self-end mr-6 mb-2">
          {genericSearchResult.length + trademarkSearchResult.length + judgementClassificationResult.length} Results
        </Badge>
      )}
      <section className="">
        {loading ? (
          <div className="flex w-full flex-col space-y-3">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <Skeleton className="h-[125px] w-full rounded-xl" />
          </div>
        ) : (
          <>
            {Array.isArray(genericSearchResult) &&
              genericSearchResult.length >= 1 &&
              genericSearchResult.map((result, index) => <ResultCard key={index} result={result} result_type={searchType} />)}

            {trademarkSearchResult &&
              trademarkSearchResult.map((result, index) => <ResultCard key={index} result={result} result_type={searchType} />)}

            {judgementClassificationResult.result && <ResultCard result={judgementClassificationResult} result_type={searchType} />}
          </>
        )}
      </section>
    </div>
  );
};

const SearchTypeRadio = ({ searchType, handleSearchType }) => {
  return (
    <RadioGroup value={searchType} className="flex flex-wrap justify-center">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="generic" id="generic" />
        <Label htmlFor="generic" onClick={() => handleSearchType("generic")}>
          Generic Cases
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="trademark" id="trademark" />
        <Label htmlFor="trademark" onClick={() => handleSearchType("trademark")}>
          Trademark Ordinance
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="judgement" id="judgement" />
        <Label htmlFor="judgement" onClick={() => handleSearchType("judgement")}>
          Judgement Classification
        </Label>
      </div>
    </RadioGroup>
  );
};

const TrademarkSearch = ({ form, onSubmit, inputType, setInputType, searchType, placeholder }) => {
  return (
    <div className="flex justify-center items-center gap-x-2 ">
      <Select
        className=""
        defaultValue="text"
        onValueChange={(value) => {
          setInputType(value);
          form.reset();
        }}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="section">Section</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <TextSearchInput {...{ form, onSubmit, inputType, searchType, placeholder }} />
    </div>
  );
};

export default SearchPage;
