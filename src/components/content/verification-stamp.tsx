import { Icon } from "@/components/icons";
import { formatVerifiedDate } from "@/lib/public-content";

interface VerificationStampProps {
  date: string;
  label?: string;
}

export function VerificationStamp({
  date,
  label = "Last verified",
}: VerificationStampProps) {
  return (
    <p className="verification-stamp">
      <Icon name="checkCircle" />
      <span>{label}</span>
      <time dateTime={date}>{formatVerifiedDate(date)}</time>
    </p>
  );
}
