import RadioPortal from "@/components/RadioPortal";
import { stations } from "@/data/stations";

export default function HomePage() {
  return <RadioPortal stations={stations} />;
}
