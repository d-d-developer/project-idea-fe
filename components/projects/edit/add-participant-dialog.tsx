"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserSelect } from "@/components/user-select";

interface AddParticipantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (profileId: string) => void;
}

export function AddParticipantDialog({
  open,
  onOpenChange,
  onAdd,
}: AddParticipantDialogProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleAdd = () => {
    if (selectedUser) {
      onAdd(selectedUser);
      onOpenChange(false);
      setSelectedUser(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Participant</DialogTitle>
          <DialogDescription>
            Search and select a user to add as a participant.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <UserSelect
            value={selectedUser}
            onChange={(value) => setSelectedUser(value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!selectedUser}>
            Add Participant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
