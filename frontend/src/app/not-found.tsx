import { PageContentContainer } from "@/components/ui/pageContentContainer";

// In case of 404.
export default function NotFound() {
    return (
        <PageContentContainer className="flex flex-col justify-center items-center">
            <h1>404</h1>
            <p>Didn't find what you were looking for!</p>
        </PageContentContainer>
    );
}