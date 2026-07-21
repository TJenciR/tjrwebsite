import {
  AlertTriangle,
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Code2,
  Command,
  Download,
  ExternalLink,
  FileText,
  FolderCode,
  Home,
  ImageIcon,
  Inbox,
  Info,
  LockKeyhole,
  Menu,
  Plus,
  Search,
  Settings,
  Terminal,
  UserRound,
  X,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

const iconRegistry = {
  alert: AlertTriangle,
  arrowRight: ArrowRight,
  bell: Bell,
  briefcase: BriefcaseBusiness,
  check: Check,
  checkCircle: CheckCircle2,
  chevronRight: ChevronRight,
  code: Code2,
  command: Command,
  danger: CircleAlert,
  document: FileText,
  download: Download,
  externalLink: ExternalLink,
  home: Home,
  image: ImageIcon,
  inbox: Inbox,
  info: Info,
  lock: LockKeyhole,
  menu: Menu,
  plus: Plus,
  projects: FolderCode,
  search: Search,
  settings: Settings,
  terminal: Terminal,
  user: UserRound,
  close: X,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconRegistry;

export interface IconProps extends Omit<LucideProps, "name"> {
  name: IconName;
}

export function Icon({ name, size = "1em", strokeWidth = 1.75, ...props }: IconProps) {
  const IconComponent = iconRegistry[name];

  return (
    <IconComponent
      aria-hidden="true"
      focusable="false"
      size={size}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}
