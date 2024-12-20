"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface SocialProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarURL: string;
  bio: string;
  links?: Record<string, string>;
}

interface UserSelectProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  multiple?: boolean;
}

export function UserSelect({ value, onValueChange, multiple = false }: UserSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [profiles, setProfiles] = React.useState<SocialProfile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = React.useState<SocialProfile[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Aggiorna i profili selezionati quando cambia value o profiles
  React.useEffect(() => {
    const selected = profiles.filter(profile => value.includes(profile.id));
    setSelectedProfiles(selected);
  }, [value, profiles]);

  const searchProfiles = React.useCallback(async (query: string) => {
    if (!query) {
      setProfiles([]);
      return;
    }
    setLoading(true);
    try {
      const response = await api(`/social-profiles/search?query=${encodeURIComponent(query)}&size=10`, {
        method: "GET",
      });
      
      const profileList = response.data._embedded?.socialProfileList || [];
      setProfiles(prevProfiles => {
        // Mantieni i profili selezionati che non sono nei risultati della ricerca
        const selectedNotInSearch = selectedProfiles.filter(
          selected => !profileList.some(p => p.id === selected.id)
        );
        return [...selectedNotInSearch, ...profileList];
      });
      
    } catch (error: any) {
      console.error("Error searching profiles:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred while searching profiles";
      toast({
        variant: "destructive",
        title: "Error searching profiles",
        description: errorMessage,
        duration: 3000,
      });
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [selectedProfiles, toast]);

  const handleSearch = () => {
    if (searchTerm.trim().length < 2) {
      toast({
        variant: "destructive",
        title: "Invalid search",
        description: "Search query must be at least 2 characters long",
        duration: 3000,
      });
      return;
    }
    searchProfiles(searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => 
        prev < allProfiles.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
    }
  };

  const handleSelect = (profile: SocialProfile) => {
    if (multiple) {
      const newValue = value.includes(profile.id)
        ? value.filter(id => id !== profile.id)
        : [...value, profile.id];
      onValueChange(newValue);
    } else {
      onValueChange([profile.id]);
      setOpen(false);
    }
  };

  const getDisplayName = (profile: SocialProfile) => {
    return `${profile.firstName} ${profile.lastName}`;
  };

  const getInitials = (profile: SocialProfile) => {
    return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  };

  // Combine selected profiles with search results, removing duplicates
  const allProfiles = React.useMemo(() => {
    const profileMap = new Map<string, SocialProfile>();
    
    // Add all profiles first
    profiles.forEach(profile => {
      profileMap.set(profile.id, profile);
    });
    
    return Array.from(profileMap.values());
  }, [profiles]);

  // Reset focused index when profiles change
  React.useEffect(() => {
    setFocusedIndex(-1);
  }, [allProfiles]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          aria-label="Select participants"
        >
          {selectedProfiles.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedProfiles.map((profile) => (
                <Badge
                  key={profile.id}
                  variant="secondary"
                  className="mr-1 flex items-center gap-1"
                >
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={profile.avatarURL} alt={getDisplayName(profile)} />
                    <AvatarFallback>{getInitials(profile)}</AvatarFallback>
                  </Avatar>
                  {getDisplayName(profile)}
                </Badge>
              ))}
            </div>
          ) : (
            "Select participants..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[300px] p-3 relative z-50" 
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        style={{ 
          pointerEvents: 'auto',
          position: 'relative',
          isolation: 'isolate'
        }}
        align="end"
        side="bottom"
        sideOffset={5}
        alignOffset={0}
      >
        <div className="flex items-center space-x-2 mb-3">
          <Input
            ref={inputRef}
            placeholder="Search participants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            aria-label="Search participants"
          />
          <Button 
            size="sm"
            variant="secondary"
            onClick={handleSearch}
            disabled={loading}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {loading ? (
          <div className="text-center py-2 text-sm text-muted-foreground">Searching...</div>
        ) : allProfiles.length === 0 ? (
          <div className="text-center py-2 text-sm text-muted-foreground">No participants found</div>
        ) : (
          <ScrollArea className="h-72">
            <div className="space-y-1" role="listbox">
              {allProfiles.map((profile, index) => (
                <button
                  key={profile.id}
                  type="button"
                  role="option"
                  aria-selected={value.includes(profile.id)}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelect(profile);
                  }}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onFocus={() => setFocusedIndex(index)}
                  className={cn(
                    "flex items-center gap-2 w-full p-2 rounded-md",
                    "text-left cursor-pointer outline-none",
                    "hover:bg-accent focus-visible:bg-accent",
                    value.includes(profile.id) && "bg-accent",
                    focusedIndex === index && "bg-accent"
                  )}
                  tabIndex={0}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={profile.avatarURL} alt={getDisplayName(profile)} />
                    <AvatarFallback>{getInitials(profile)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium truncate">{getDisplayName(profile)}</span>
                    <span className="text-xs text-muted-foreground truncate">@{profile.username}</span>
                  </div>
                  {value.includes(profile.id) && (
                    <Check className="h-4 w-4 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
