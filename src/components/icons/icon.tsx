import {
  AlertTriangle,
  ArrowRight,
  Bell,
  BrainCircuit,
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
  Gamepad2,
  GraduationCap,
  Home,
  ImageIcon,
  Inbox,
  Info,
  LockKeyhole,
  MapPin,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Pin,
  Plus,
  Search,
  Settings,
  SunMoon,
  Terminal,
  Timer,
  UserRound,
  X,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

const iconRegistry = {
  alert: AlertTriangle,
  arrowRight: ArrowRight,
  bell: Bell,
  brain: BrainCircuit,
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
  gamepad: Gamepad2,
  graduation: GraduationCap,
  home: Home,
  image: ImageIcon,
  inbox: Inbox,
  info: Info,
  lock: LockKeyhole,
  location: MapPin,
  menu: Menu,
  panelClose: PanelLeftClose,
  panelOpen: PanelLeftOpen,
  pin: Pin,
  plus: Plus,
  projects: FolderCode,
  search: Search,
  settings: Settings,
  appearance: SunMoon,
  terminal: Terminal,
  timer: Timer,
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
