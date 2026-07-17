import CtaButton from "@/components/ui/CtaButton";
import Container from "@/components/ui/Container";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";

export default function NotFound() {
  return (
    <>
      <BreadcrumbHero title="Page Not Found" />
      <section className="py-16 text-center lg:py-25">
        <Container>
          <p className="mx-auto max-w-xl text-body">
            The page you&rsquo;re looking for doesn&rsquo;t exist or may have
            moved. Head back to the homepage or reach out if you need help
            finding something.
          </p>
          <div className="mt-8">
            <CtaButton href="/">Back to Home</CtaButton>
          </div>
        </Container>
      </section>
    </>
  );
}
