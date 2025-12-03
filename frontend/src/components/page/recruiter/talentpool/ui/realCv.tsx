import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

type RealCvProps = {
    cv: Uint8Array
};

export default function RealCv({ cv }: RealCvProps) {
    const [pages, setPages] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const [pageWidth, setPageWidth] = useState<number>(0);
    const fileData = useMemo(() => ({ data: cv }), [cv]);

    // Measure container width.
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                const width = containerRef.current.clientWidth;

                setPageWidth(width);
            }
        };

        // Set initial width.
        updateWidth();

        // Add resize listener.
        window.addEventListener("resize", updateWidth);

        // Clean up listener on unmount.
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    return (
        <div className="w-full" ref={containerRef}>
            { pageWidth > 0 && 
                <Document file={fileData} onLoad={({ numPages }) => setPages(numPages)} onLoadError={console.error}>
                    {
                        Array.from(new Array(pages), (_, index) => 
                            (<Page key={index + 1} pageNumber={index + 1} renderTextLayer={false} renderAnnotationLayer={false} width={pageWidth}></Page>))
                    }
                </Document>
            }
        </div>
    );
}