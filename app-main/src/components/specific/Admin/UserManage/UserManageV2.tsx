"use client";

import { useCallback } from "react";
import { useMutationCreateUserSupabase } from "@/hooks/user/useMutationCreateUserSupabase";
import { useMutationDeleteUserSupabase } from "@/hooks/user/useMutationDeleteUserSupabase";
import { useMutationModifyUserSupabase } from "@/hooks/user/useMutationModifyUserSupabase";
import { useQueryUsersDomain } from "@/hooks/user/useQueryUsersDomain";
import { UserSelect2 } from "@/components/ui/user-select2";

enum Role {
  USER = "USER",
  MODERATOR = "MODERATOR", 
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN"
}

interface User {
  id: string;
  email: string;
  role: Role;
}

const UserManageV2 = () => {
  const createUserMutation = useMutationCreateUserSupabase();
  const deleteUserMutation = useMutationDeleteUserSupabase();
  const modifyUserMutation = useMutationModifyUserSupabase();
  const { data: users = [], isLoading } = useQueryUsersDomain();

  const handleCreateUser = useCallback(
    (email: string, role: Role) => {
      createUserMutation.mutate({ email, role });
    },
    [createUserMutation]
  );

  const handleUpdateUser = useCallback(
    (id: string, email: string, role: Role) => {
      modifyUserMutation.mutate({ id, email, role });
    },
    [modifyUserMutation]
  );

  const handleDeleteUser = useCallback(
    (id: string) => {
      deleteUserMutation.mutate(id);
    },
    [deleteUserMutation]
  );

  const mappedUsers: User[] = users.map((user) => ({
    id: user.id,
    email: user.email ?? "",
    role: user.role as Role,
  }));

  return (
    <UserSelect2
      users={mappedUsers}
      onCreateUser={handleCreateUser}
      onUpdateUser={handleUpdateUser}
      onDeleteUser={handleDeleteUser}
      isLoading={isLoading}
      className="max-w-2xl mx-auto"
    />
  );
};

export default UserManageV2;
