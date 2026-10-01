import Link from "next/link";
import { LocalizedText } from "@/components/LocalizedText";

export default function NotFound() {
  return (
    <section className="container-shell py-24 text-center">
      <p className="eyebrow"><LocalizedText id="notFound.eyebrow" /></p>
      <h1 className="mt-4 font-display text-5xl"><LocalizedText id="notFound.title" /></h1>
      <p className="mx-auto mt-4 max-w-md text-muted"><LocalizedText id="notFound.description" /></p>
      <Link href="/search" className="button-primary mt-8"><LocalizedText id="notFound.button" /></Link>
    </section>
  );
}
