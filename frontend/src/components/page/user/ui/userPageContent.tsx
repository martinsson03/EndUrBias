import PaginatedJobList from "./paginatedJobList";
import SearchBar from "./searchBarClient";

// Contains the content on the user page.
export default function UserPageContent() {
    return(
        <div className="flex flex-col gap-10">
            <SearchBar></SearchBar>
            <PaginatedJobList></PaginatedJobList>
        </div>
    );
}