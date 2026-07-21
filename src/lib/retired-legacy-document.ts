const headers = {
  "Cache-Control": "no-store",
  "Content-Type": "text/plain; charset=utf-8",
  "X-Robots-Tag": "noindex, noarchive",
};

export function getRetiredLegacyDocument() {
  return new Response(
    "This legacy qualification document was intentionally removed pending a privacy and publication review.",
    { headers, status: 410 },
  );
}

export function headRetiredLegacyDocument() {
  return new Response(null, { headers, status: 410 });
}
