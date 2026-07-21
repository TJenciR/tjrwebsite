import type { StructuredData } from "@/lib/structured-data";

interface JsonLdProps {
  data: StructuredData;
  id: string;
}

export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replaceAll("<", "\\u003c"),
      }}
      id={id}
      type="application/ld+json"
    />
  );
}
