import * as LucideIcons from "lucide-react";

interface IconPlaceholderProps extends React.SVGProps<SVGSVGElement> {
  lucide?: string;
  tabler?: string;
  hugeicons?: string;
  phosphor?: string;
  remixicon?: string;
}

/**
 * Icon placeholder component for shadcn/ui base-nova style.
 * Resolves the `lucide` prop to the corresponding lucide-react icon.
 */
export function IconPlaceholder({ lucide, ...props }: IconPlaceholderProps) {
  if (!lucide) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as Record<string, any>)[lucide];

  if (!Icon) return null;

  return <Icon {...props} />;
}
