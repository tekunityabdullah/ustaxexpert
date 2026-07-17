export default function BreadcrumbHero({ title }: { title: string }) {
  return (
    <div className="bg-navy-900 pt-[130px] pb-10 text-center lg:pt-[150px]">
      <h2 className="text-white">{title}</h2>
    </div>
  );
}
