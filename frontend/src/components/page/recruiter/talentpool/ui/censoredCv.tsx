import MarkdownFormatter from "@/components/ui/markdownFormatter";
import { Card } from "@/components/shadcn/ui/card";

type CensoredCvProps = {
    cv: string
};

export default function CensoredCv({ cv }: CensoredCvProps) {
    return (
        <Card className="p-5 gap-3">
            <MarkdownFormatter markdown={cv}></MarkdownFormatter>
        </Card>
    );
}