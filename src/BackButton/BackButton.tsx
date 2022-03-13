import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; 

interface BackButtonProps {
  onClick: () => void
}

const BackButton = ({ onClick }: BackButtonProps) => (
  <span 
    className="
      text-2xl absolute top-5 left-7 
      font-bold italic 
      cursor-pointer 
      hover:underline hover:underline-offset-4 
    " 
    onClick={onClick}
  >
    <FontAwesomeIcon icon={faArrowLeft} className="mr-3" /> 
    Go back
  </span>
);

export default BackButton;