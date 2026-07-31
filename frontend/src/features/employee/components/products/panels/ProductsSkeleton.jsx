import { Package } from "lucide-react";

const Skeleton = () => (
  <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-100 bg-white">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-green-200 border-t-green-600" />
      <p className="text-sm text-gray-400">Cargando productos...</p>
    </div>
  </div>
);

export default Skeleton;
