"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowBigRight, Check, ChevronsUpDown, Home, Plus } from "lucide-react";

import { Community } from "@dq/db";
import { cn } from "@dq/ui";
import { Button, buttonVariants } from "@dq/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@dq/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@dq/ui/popover";

interface CommunityComboboxProps {
  communities: Community[];
}

export function CommunityCombobox({ communities }: CommunityComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const pattern = /\/c\/(.*)/;
  const match = pathname.match(pattern);
  const rawMatch = match ? match[1] : "";
  const [communityName, ...rest] = rawMatch.split("/");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {match ? (
            <p className="overflow-hidden truncate">
              {rest.includes("settings") ? rawMatch : communityName}
            </p>
          ) : (
            <div className="flex items-center gap-x-2 text-muted-foreground">
              <Home className="h-4 w-4" /> Home
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <Link
            className={buttonVariants({ variant: "ghost" })}
            href="/c/create"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create community
          </Link>
          <CommandEmpty>No communities found..</CommandEmpty>
          <CommandSeparator />
          <CommandGroup>
            {communities.map((community) => (
              <Link
                href={`/c/${community.name}`}
                key={community.id}
                passHref
                className="group"
              >
                <CommandItem>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      communityName === community.name
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />

                  <p className="overflow-hidden truncate">{community.name}</p>
                  {communityName !== community.name && (
                    <ArrowBigRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  )}
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
