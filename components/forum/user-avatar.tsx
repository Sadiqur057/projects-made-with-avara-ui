import { Avatar, AvatarFallback, AvatarImage } from "@/components/custom/ui/avatar";
import { avatarSrc, initials } from "@/lib/forum/format";
import { cn } from "@/lib/utils";

const SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-24 w-24 text-2xl",
} as const;

export function UserAvatar({
  username,
  name,
  size = "md",
  className,
}: {
  username: string;
  name?: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <Avatar className={cn(SIZES[size], "ring-1 ring-border", className)}>
      <AvatarImage src={avatarSrc(username, name)} alt={name ?? username} />
      <AvatarFallback className="bg-muted text-muted-foreground font-medium">
        {initials(name ?? username)}
      </AvatarFallback>
    </Avatar>
  );
}
