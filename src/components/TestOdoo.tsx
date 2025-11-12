import { useEffect, useState } from "react";

interface Customer {
  id: number;
  name: string;
  email?: string;
}

export default function TestOdoo() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:8069/api/customers", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa("nehasaleem596@gmail.com:fypproject2025")
          },
        });

        if (!response.ok) throw new Error("Failed to fetch customers");

        const data = await response.json();
        setCustomers(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchCustomers();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Customers</h1>
      <ul>
        {customers.map((c) => (
          <li key={c.id}>{c.name} - {c.email}</li>
        ))}
      </ul>
    </div>
  );
}
