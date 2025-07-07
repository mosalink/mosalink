"use client";

import CategoryManageV2 from "./CategoryManage/CategoryManageV2";
import UserManageV2 from "./UserManage/UserManageV2";

const Admin = () => {
  return (
    <div className="flex flex-col gap-8 items-center py-20 px-4">
      <h1 className="font-bold text-3xl text-center">Administration</h1>
      <CategoryManageV2 />
      <UserManageV2 />
    </div>
  );
};

export default Admin;
