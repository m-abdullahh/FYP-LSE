import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";
import jsPDF from "jspdf";

const ResultCard = ({ result, result_type }) => {
  console.log(result);
  const [isExpanded, setIsExpanded] = useState(false);

  // const generatePDF = () => {
  //   const doc = new jsPDF();

  //   // Add title
  //   doc.setFontSize(16);
  //   doc.text(result.Title, 10, 10);

  //   // Add date
  //   doc.setFontSize(12);
  //   doc.text(result.Date, 10, 20);

  //   // Add sections
  //   doc.setFontSize(12);
  //   doc.text("Facts:", 10, 30);
  //   doc.setFontSize(10);
  //   doc.text(result.Facts, 10, 40);

  //   // Add decisions/holdings
  //   doc.setFontSize(12);
  //   doc.text("Decisions/Holdings:", 10, 60);
  //   doc.setFontSize(10);
  //   doc.text(result.Decisions_Holdings, 10, 70, { maxWidth: 190 });

  //   // Add issues framed
  //   doc.setFontSize(12);
  //   doc.text("Issues Framed:", 10, 100);
  //   doc.setFontSize(10);
  //   doc.text(result.Issues_framed, 10, 110, { maxWidth: 190 });

  //   // Add reasoning and analysis
  //   doc.setFontSize(12);
  //   doc.text("Reasoning and Analysis:", 10, 140);
  //   doc.setFontSize(10);
  //   doc.text(result.Reasoning_and_Analysis, 10, 150, { maxWidth: 190 });

  //   // Add result
  //   doc.setFontSize(12);
  //   doc.text("Result:", 10, 180);
  //   doc.setFontSize(10);
  //   doc.text(result.result, 10, 190);

  //   // Save the PDF
  //   doc.save(`${result.Title || "Legal_Case"}.pdf`);
  // };

  return (
    <>
      {result_type === "generic" && (
        <Card className="mb-4 w-full cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className={"font-semibold text-md " + `${!isExpanded && "line-clamp-1"}`}>{result.Title}</CardTitle>
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            {/* <CardDescription className={"mt-2 text-sm " + `${!isExpanded && "line-clamp-1"}`}>{result.Title}</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">{result.Date}</span>
              <Badge>{result.result}</Badge>
            </div>
            {isExpanded && (
              <div className="gap-4 grid mt-4">
                <Separator />
                <div>
                  <h3 className="mb-2 font-semibold">Issues Framed</h3>
                  <p className="text-sm">{result.Issues_framed}</p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Decision/Holdings</h3>
                  <p className="text-sm">{result.Decisions_Holdings}</p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Reasoning and Analysis</h3>
                  <p className="text-sm">{result.Reasoning_and_Analysis}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {result_type === "trademark" && (
        <Card className="mb-4 w-full cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <CardHeader className="py-4">
            <div className="flex justify-between items-start">
              <CardTitle className={"font-semibold text-md " + `${!isExpanded && "line-clamp-1"}`}>{result.sect_desc}</CardTitle>
              <Badge variant={"default"}>
                Section. ({result.sect_no}, {result.subsec_1}
                {result.subsec_2}
                {result.subsec_3}), {result.chapter_no}
              </Badge>
            </div>
            <div className="gap-4 grid mt-4">
              <div>
                <p className="text-sm">{result.subsec_desc}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {result_type === "judgement" && (
        <div className="text-center">
          <CardTitle className={"font-semibold text-lg " + `${!isExpanded && "line-clamp-1"}`}> Result of this Case is "{result.result}</CardTitle>
        </div>
      )}
    </>
  );
};

export default ResultCard;
