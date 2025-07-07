import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useMutationDeleteUser } from "@/hooks/user/useMutationDeleteUser";
import { useMutationModifyUser } from "@/hooks/user/useMutationModifyUser";
import { useCallback, useState } from "react";

type Role = 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';

interface Props {
  id: string;
  email: string;
  role: Role;
}

const UserItem = ({ id, email, role }: Props) => {
  const deleteUserMutation = useMutationDeleteUser();
  const modifyUserMutation = useMutationModifyUser();

  const [openDialog, setOpenDialog] = useState(false);

  const handleDeleteUser = useCallback(
    (userId: string) => {
      deleteUserMutation.mutate(userId);
      setOpenDialog(false);
    },
    [deleteUserMutation]
  );

  const handleModifyUser = useCallback(
    (role: Role) => {
      modifyUserMutation.mutate({
        id: id,
        role,
        email,
      });
    },
    [email, id, modifyUserMutation]
  );

  return (
    <div
      key={id}
      className="flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center"
    >
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <p className="whitespace-nowrap">{email}</p>
        <Select
          defaultValue={role}
          onValueChange={(role: Role) => handleModifyUser(role)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Role de l'utilisateur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Administrateur</SelectItem>
            <SelectItem value="USER">Utilisateur</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger className="text-red-500 text-sm font-bold cursor-pointer">
          Supprimer
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Voulez vous vraiment supprimer cet utilisateur ?
            </DialogTitle>
            <DialogDescription>
              En supprimant le compte {email}, vous allez supprimer toutes les
              liens qui appartiennent à cet utilisateur
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"destructive"}
              type="submit"
              onClick={() => handleDeleteUser(id)}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Separator className="md:hidden" />
    </div>
  );
};

export default UserItem;
