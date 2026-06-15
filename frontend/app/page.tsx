import Link from "next/link";

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        Library Management System
      </h1>

      <ul className="space-y-4">
        <li>
          <Link href="/books">
            📚 Books
          </Link>
        </li>

        <li>
          <Link href="/members">
            👤 Members
          </Link>
        </li>

        <li>
          <Link href="/transactions">
            🔄 Transactions
          </Link>
        </li>
      </ul>
    </main>
  );
}