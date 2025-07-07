import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQueryBookmarksFolder } from "@/hooks/bookmark/useQueryBookmarksFolder";
import { useMutationAddUserToFolder } from "@/hooks/folder/useMutationAddUserToFolder";
import { useMutationDeleteUserToFolder } from "@/hooks/folder/useMutationDeleteUserToFolder";
import { useQueryUsersDomain } from "@/hooks/user/useQueryUsersDomain";
import { Users, Plus, Trash2, Crown, Search } from "lucide-react";
import { useCallback, useState } from "react";

interface Props {
  folderId: string;
}

const UserProjet = ({ folderId }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const {
    data: dataProjet,
    isLoading: isLoadingProjet,
    isError: isErrorProjet,
  } = useQueryBookmarksFolder(folderId);
  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useQueryUsersDomain();
  const addUserToFolderMutation = useMutationAddUserToFolder();
  const deleteUserToFolderMutation = useMutationDeleteUserToFolder();

  const handleDeleteUser = useCallback(
    (userId: string) => {
      deleteUserToFolderMutation.mutate({
        folderId,
        userId,
      });
    },
    [deleteUserToFolderMutation, folderId]
  );

  const handleAddUserToFolder = useCallback(
    (userId: string) => {
      addUserToFolderMutation.mutate({
        folderId,
        userId,
      });
      setSearchTerm("");
    },
    [addUserToFolderMutation, folderId]
  );

  if (isLoadingProjet || isLoadingUser) {
    return null;
  }

  if (isErrorProjet || isErrorUser) {
    return null;
  }

  if (!dataProjet || !dataUser) {
    return null;
  }

  const availableUsers = dataUser?.filter(
    (user) => !dataProjet.users?.some((userFolder) => userFolder.id === user.id)
  ) || [];

  const filteredUsers = availableUsers.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DialogContent className="max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto overflow-x-hidden">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-lg">
          <Users className="w-5 h-5" />
          Projet {dataProjet?.name}
        </DialogTitle>
        <DialogDescription>
          Gérez les membres de votre projet
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6 py-4 overflow-hidden">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">
              Membres du projet
            </h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {dataProjet.users?.length || 0}
            </span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {dataProjet.users?.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                    user.id === dataProjet.userCreatorId 
                      ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-sm' 
                      : 'bg-gradient-to-br from-blue-100 to-blue-200'
                  }`}>
                    {user.id === dataProjet.userCreatorId ? (
                      <Crown className="w-4 h-4 text-yellow-600" />
                    ) : (
                      <Users className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.email}
                    </p>
                    <p className={`text-xs transition-colors duration-200 ${
                      user.id === dataProjet.userCreatorId 
                        ? 'text-yellow-600 font-medium' 
                        : 'text-gray-500'
                    }`}>
                      {user.id === dataProjet.userCreatorId ? 'Propriétaire' : 'Membre'}
                    </p>
                  </div>
                </div>
                {user.id !== dataProjet.userCreatorId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={deleteUserToFolderMutation.isLoading}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 ml-2 flex-shrink-0"
                  >
                    {deleteUserToFolderMutation.isLoading ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {availableUsers.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Ajouter un membre
            </h3>
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Rechercher par email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              
              {searchTerm && (
                <div className="max-h-44 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-sm">
                  {filteredUsers.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <Users className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">
                        Aucun utilisateur trouvé pour &quot;{searchTerm}&quot;
                      </p>
                    </div>
                  ) : (
                    <div className="py-1">
                      {filteredUsers.slice(0, 10).map((user: any, index: number) => (
                        <div
                          key={user.id}
                          onClick={() => handleAddUserToFolder(user.id)}
                          className={`
                            flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150
                            hover:bg-blue-50 hover:shadow-sm active:bg-blue-100
                            ${index !== filteredUsers.length - 1 ? 'border-b border-gray-100' : ''}
                            ${addUserToFolderMutation.isLoading ? 'pointer-events-none opacity-50' : ''}
                          `}
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {user.email}
                            </div>
                            {user.name && (
                              <div className="text-sm text-gray-500 truncate">
                                {user.name}
                              </div>
                            )}
                          </div>
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Plus className="w-3 h-3 text-green-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {!searchTerm && (
                <div className="text-center py-4">
                  <Search className="mx-auto h-6 w-6 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">
                    Commencez à taper pour rechercher des utilisateurs
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {availableUsers.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
            <Users className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">
              Tous les utilisateurs du domaine sont déjà membres de ce projet
            </p>
          </div>
        )}
      </div>
    </DialogContent>
  );
};

export default UserProjet;
