const CarouselNavigation = () => (
  <>
    <div className="swiper-button-prev-custom absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-2xl w-12 h-12 flex items-center justify-center shadow-2xl cursor-pointer hover:bg-gray-50 hover:scale-110 transition-all duration-300 -ml-6 border border-gray-200">
      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </div>
    <div className="swiper-button-next-custom absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-2xl w-12 h-12 flex items-center justify-center shadow-2xl cursor-pointer hover:bg-gray-50 hover:scale-110 transition-all duration-300 -mr-6 border border-gray-200">
      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </>
);

export default CarouselNavigation;