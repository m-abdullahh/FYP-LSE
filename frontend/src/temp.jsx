import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Component() {
  const [searchType, setSearchType] = useState("generic");
  const [searchInput, setSearchInput] = useState("");
  const [trademarkSearchType, setTrademarkSearchType] = useState("text");
  const [results, setResults] = (useState < string) | (null > null);

  const handleSearch = () => {
    // Simulating search results
    switch (searchType) {
      case "generic":
        setResults(`Generic case search results for: ${searchInput}`);
        break;
      case "trademark":
        setResults(`Trademark ordinance search results for ${trademarkSearchType}: ${searchInput}`);
        break;
      case "judgement":
        setResults(`This Case was Dismissed: ${searchInput}`);
        break;
      default:
        setResults(null);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Legal Search Engine</h1>

      <RadioGroup value={searchType} onValueChange={setSearchType} className="flex justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="generic" id="generic" />
          <Label htmlFor="generic">Generic Cases</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="trademark" id="trademark" />
          <Label htmlFor="trademark">Trademark Ordinance</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="judgement" id="judgement" />
          <Label htmlFor="judgement">Judgement Classification</Label>
        </div>
      </RadioGroup>

      <div className="flex space-x-2">
        {searchType === "trademark" && (
          <Select value={trademarkSearchType} onValueChange={setTrademarkSearchType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Search by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="section">Section No.</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Input
          type="text"
          placeholder="Enter your search query"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {results && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Search Results:</h2>
          <p>{results}</p>
        </div>
      )}
    </div>
  );
}
