import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

async function getCustomers() {
  return db.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      _count: {
        select: { orders: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Customers</h2>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Phone</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Orders</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Joined</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{customer.name}</td>
                  <td className="px-6 py-4 text-sm">{customer.email}</td>
                  <td className="px-6 py-4 text-sm">{customer.phone || "-"}</td>
                  <td className="px-6 py-4 text-sm">{customer._count.orders}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={customer.isActive ? "success" : "secondary"}>
                      {customer.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
