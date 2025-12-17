export const dynamic = "force-dynamic";
import { UserByRole } from "@/actions/actions";
import UserTable from "@/components/AdminDashboard/User/UserTable/UserTable";

const UserManagement = async ({ params }) => {
  const { role } = await params;
  const users = await UserByRole({ role });
  return (
    <div>
      <div className="">
        <UserTable users={JSON.stringify(users)} />
      </div>
    </div>
  );
};

export default UserManagement;
