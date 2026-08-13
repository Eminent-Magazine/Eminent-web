import { Studio } from "sanity";
// import { studioConfig } from "@/sanity/config";
import config from "../../../sanity.config";

export default function StudioRoot() {
  return (
    <div className="h-[calc(100vh-3.5rem)] lg:h-screen">
      <Studio config={config} />
    </div>
  );
}
