// The destination search box, used in the home page hero and on /search. A plain GET form to
// /search?q=…, so it works before the page's scripts load.
export default function SearchForm({ defaultValue = '', autoFocus = false, className = '' }: { defaultValue?: string; autoFocus?: boolean; className?: string }) {
  return (
    <form role="search" action="/search" className={`flex w-full max-w-[760px] items-center gap-2 rounded-full border border-[#e6e6e6] bg-white py-1.5 pr-1.5 pl-5 tablet:gap-3 tablet:py-2.5 tablet:pr-2.5 tablet:pl-8 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2" className="size-5 shrink-0 tablet:size-[22px]"><circle cx="11" cy="11" r="7"></circle><line x1="16.5" y1="16.5" x2="21" y2="21"></line></svg>
      <input type="search" name="q" aria-label="Search your destination" defaultValue={defaultValue} autoFocus={autoFocus} placeholder="Search a destination" className="min-w-0 flex-1 bg-transparent py-3 text-[16px] text-ink outline-0 tablet:py-3.5 tablet:text-[20px] [&::-webkit-search-cancel-button]:hidden" />
      <button type="submit" className="shrink-0 cursor-pointer rounded-full bg-bd-green px-5 py-3.5 text-[15px] font-bold text-white hover:bg-[#00573f] tablet:px-9 tablet:py-5 tablet:text-[17px]">Search</button>
    </form>
  );
}
