const CardSkeleton = () => {
  return (
    <div className="relative border-2 border-gray-100 rounded-xl bg-white shadow-md w-full h-full flex flex-col animate-pulse overflow-hidden">
      <div className="absolute top-4 right-4 h-8 w-8 bg-gray-200 rounded-full"></div>
      <div className="w-full h-48 bg-gray-200 rounded-t-xl"></div>
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          <div className="mt-2 space-y-2 min-h-[56px]">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-6 w-5/6 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div>
          <div className="h-8 w-1/2 bg-gray-200 rounded mt-2"></div>
          <div className="h-3 w-3/4 bg-gray-200 rounded mt-1"></div>
        </div>
      </div>
      <div className="px-4 pb-4 h-[92px] flex flex-col justify-center">
        <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default CardSkeleton;
