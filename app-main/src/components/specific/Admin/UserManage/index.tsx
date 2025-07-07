import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutationCreateUser } from "@/hooks/user/useMutationCreateUser";
import { useQueryUsersDomain } from "@/hooks/user/useQueryUsersDomain";
import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserItem from "./UserItem";

type Role = 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';

const UserManage = () => {
  const createUserMutation = useMutationCreateUser();
  const { data, isLoading, isError } = useQueryUsersDomain();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("USER");
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setNumberOfUsers(data?.length ?? 0);
  }, [data?.length]);

  const handleCreateUser = useCallback(
    (event: React.SyntheticEvent) => {
      event.preventDefault();
      createUserMutation.mutate({ email, role: "USER" });
    },
    [email, createUserMutation]
  );

  return (
    <div className="flex flex-col gap-4 border rounded-md p-8">
      <h2 className="text-xl font-bold">Les {numberOfUsers} utilisateur(s)</h2>
      <form className="flex flex-col md:flex-row gap-4">
        <Input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Select defaultValue="USER">
          <SelectTrigger>
            <SelectValue placeholder="Role de l'utilisateur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Administrateur</SelectItem>
            <SelectItem value="USER">Utilisateur</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="md:w-80" onClick={handleCreateUser}>
          Ajouter un utilisateur
        </Button>
      </form>
      <div className="flex flex-col gap-4 md:gap-2">
        {data &&
          data
            .sort((a, b) => {
              if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
              if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;
              return 0;
            })
            .map((user) => (
              <UserItem
                key={user.id}
                id={user.id}
                email={user.email ?? ""}
                role={(user.role as Role) ?? "USER"}
              />
            ))}
      </div>
    </div>
  );
};

export default UserManage;
