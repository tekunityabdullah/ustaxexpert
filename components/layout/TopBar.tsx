import { siteConfig } from "@/lib/site-config";
import Container from "@/components/ui/Container";

export default function TopBar() {
  return (
    <div className="hidden bg-navy-800 py-2.5 text-[13px] text-white lg:block">
      <Container wide className="flex items-center justify-between">
        <span>
          <strong className="font-semibold">Address:</strong> {siteConfig.address}
        </span>
        <span>
          <strong className="font-semibold">Call:</strong>{" "}
          {siteConfig.phones[0].label}
        </span>
      </Container>
    </div>
  );
}
