"use client"

import { PageContentContainer } from "@/components/ui/pageContentContainer";
import { DecodeB64ToUint8Array, EncodeB64FromUint8Array } from "@/lib/shared/base64";
import { ChangeEvent, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

export default function EncodeDecodePdf() {
    const [file, setFile] = useState<File | null>(null);
    const [fileB64, setFileB64] = useState<string>("");
    const [fileDecodedB64, setFileDecodedB64] = useState<Uint8Array | null>(null);
    const [pages, setPages] = useState(1);
    
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null;
    
        setFile(selected);

        if (selected) {
            const encoded = EncodeB64FromUint8Array(new Uint8Array(await selected.arrayBuffer()));
            const decoded = DecodeB64ToUint8Array(encoded);

            setFileB64(encoded);
            setFileDecodedB64(decoded);
        }

        e.target.value = "";
    };

    return (
        <PageContentContainer className="flex flex-col">
            <input type="file" onChange={handleFileChange} className="bg-blue-500 hover:bg-blue-700"></input>
            <p className="max-w-full overflow-x-scroll">{fileB64}</p>
            { fileDecodedB64 &&
                <Document file={{ data: fileDecodedB64 }} onLoad={({ numPages }) => setPages(numPages)} onLoadError={console.error}>
                    {
                        Array.from(new Array(pages), (_, index) => 
                            (<Page key={index + 1} pageNumber={index + 1} renderTextLayer={false} renderAnnotationLayer={false}></Page>))
                    }
                </Document>
            }

        </PageContentContainer>
    );
}