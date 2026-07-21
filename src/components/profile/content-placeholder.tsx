import { Icon, type IconName } from "@/components/icons";

interface ContentPlaceholderProps {
  description: string;
  icon?: IconName;
  title: string;
}

export function ContentPlaceholder({
  description,
  icon = "info",
  title,
}: ContentPlaceholderProps) {
  return (
    <div className="profile-content-placeholder" data-content-state="needs-confirmation">
      <Icon name={icon} />
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}
