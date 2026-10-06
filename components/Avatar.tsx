// A traveller's profile photo, or their first initial on green when they have none.
// `className` sets the size and initial's font size, e.g. "size-9 text-[15px]".
export default function Avatar({ name, image, className = 'size-9 text-[15px]' }: { name: string; image?: string | null; className?: string }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt="" referrerPolicy="no-referrer" className={`${className} shrink-0 rounded-full object-cover`} />;
  }
  return (
    <span aria-hidden="true" className={`${className} flex shrink-0 items-center justify-center rounded-full bg-bd-green font-bold text-white`}>
      {(name.trim()[0] || '?').toUpperCase()}
    </span>
  );
}
