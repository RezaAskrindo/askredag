import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-3">
      <p>Selamat Datang Di Prototipe Askredag</p>
      <Button asChild>
        <Link href="/login">Masuk</Link>
      </Button>
    </div>
  );
}
