import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

type RealCvProps = {
    cv: string
};

export default function RealCv({ cv }: RealCvProps) {
    const pdfData = `data:application/pdf;base64,${cv}`; // CV is base64 encoded!

    const [pages, setPages] = useState(1);

    return (
        <div className="overflow-y-scroll">
            <Document file={pdfData} onLoad={({ numPages }) => setPages(numPages)} onLoadError={console.error}>
                {
                    Array.from(new Array(pages), (_, index) => 
                        (<Page key={index + 1} pageNumber={index + 1} renderTextLayer={false} renderAnnotationLayer={false}></Page>))
                }
            </Document>
        </div>
    );
}