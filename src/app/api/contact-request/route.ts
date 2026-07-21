import { handleContactRequest } from "@/lib/contact/handler";
import { getContactRequestProvider } from "@/lib/contact/provider";
import { contactRateLimiter } from "@/lib/contact/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleContactRequest(request, {
    provider: getContactRequestProvider(),
    rateLimiter: contactRateLimiter,
  });
}

