import Markdown, { Components } from "react-markdown";

type MarkdownFormatterProps = {
    markdown: string
};

// Map the different html elements to another html element.
const components: Components = {
    h1: (props) => <h3 {...props}></h3>,
    h2: (props) => <h4 {...props}></h4>,
    h3: (props) => <h4 {...props}></h4>,
    h4: (props) => <h4 {...props}></h4>,
    h5: (props) => <h4 {...props}></h4>,
    p: (props) => <p className="text-seperator" {...props}></p>
};

// Formats markdown to html.
export default function MarkdownFormatter({ markdown }: MarkdownFormatterProps) {
    return (
        <Markdown components={components}>{ markdown }</Markdown>
    );
}