import { useState } from "react";
import MyModal from "./ShowModal";
const Modal = (props) => {
    const [showModal,setShowModal] = useState(false);

    const closeModal = () => setShowModal(false);
    const backend_url= process.env.backend_url;
    
  return (
    <div>
        <button className={props.buttonName} onClick={()=> setShowModal(true)}> {props.modalName} </button>
        {showModal && <MyModal data = {props.data} closeModal = {closeModal} rerender = {props.rerender} arg = {props.arg}/>}
    </div>
  )
}

export default Modal;