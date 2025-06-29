import { Link } from "react-router-dom"

const Error404 = () => {

  return (
    <>

          <br />
          <img
            src="https://cdn.pixabay.com/photo/2021/07/21/12/49/error-6482984_1280.png"
            alt=""
            className="w-175 mx-auto"
          />
        
          <button className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium">
            <svg
              width="15"
              height="11"
              viewBox="0 0 15 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
                stroke="#615fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Link to="/">Volver a inicio</Link>
          </button>
        </>
  )
}

export default Error404