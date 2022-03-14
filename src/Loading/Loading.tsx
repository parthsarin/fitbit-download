import { PacmanLoader } from "react-spinners";


const Loading = () => (
    <div className="
        absolute top-0 left-0 
        z-50 bg-black bg-opacity-70 
        w-full h-full
        flex justify-center items-center
    ">
        <div className="flex w-full h-full justify-center">
            <div className="flex self-center">
                <PacmanLoader color={'white'} size={100} />
            </div>
        </div>
    </div>
)

export default Loading;