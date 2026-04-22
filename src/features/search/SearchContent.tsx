import { Header } from "@/components/layout/Header";
import { SharedHeroSection } from "@/components/shared/ui/SharedHeroSections";
import { Spinner } from "@/components/ui/Spinner";
import { Suspense } from "react";
import { SearchResults } from "./components/SearchResults/SearchResults";
import { Footer } from "@/components/layout/Footer";
import { Property } from "@/lib/types";
import { SearchBar2 } from "./components/searchBar/SearchBar2";
import SearchCalender from "./components/searchCalender/SearchCalender";
import TrialDesign from "./components/TrialDesign";

interface SearchContentProps { 
    image: string;
    properties: Property[];
    t: (key: string) => string;
 }
export default function SearchContent({ image, properties, t }: SearchContentProps) {
  return  <>
  <Header transparent />
  <main>
    <SharedHeroSection
    headerText="search.searchHeroTitle"

    paragraphText="search.searchHeroSubtitle"
     contentClassName="relative mb-10 z-10 mx-auto box-border flex h-full w-full max-w-[1440px] flex-1 flex-col justify-center px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-[120px] lg:pb-14 lg:pt-32"
     sectionClassName="relative flex min-h-[560px] flex-col pb-[30px] sm:min-h-[700px] lg:min-h-[609px]" allProperties={[]} image={image} t={t} />
    {/* <div className="relative z-20 lg:mt-10  mx-auto w-full max-w-[856px] px-4 sm:-mt-12 sm:px-6 lg:px-8 ">
      <div className="flex items-center gap-2">
        <SearchCalender rangeLabel="16 Feb 2026 - 22 Feb 2026" />
         <SearchBar2 />
      </div>
    </div>
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <SearchResults initialProperties={properties} />
    </Suspense> */}
    <TrialDesign/>
  </main>
  <Footer />
</>
}