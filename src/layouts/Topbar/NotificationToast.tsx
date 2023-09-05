import { useToggle } from 'hooks';
import React from 'react'
import { Button, Toast, ToastContainer } from 'react-bootstrap';
import { ToastPosition } from 'react-bootstrap/esm/ToastContainer';

export type NotificationToastProps = {
    id: string;
    text: string;
    position: ToastPosition;
    bgColor: string;
    onClose?: () => void;
}

export const NotificationToast = ({ id, position, text, bgColor, onClose }: NotificationToastProps) => {
  const [isOpenCustom1, , , hideCustom1] = useToggle(true);

  return (
    <ToastContainer key={id + '-toast-container'} className='p-3' position={position}>
      <div style={{'zIndex': 99, 'position': 'fixed', 'top': 75, 'right': 0}}>
      <Toast
                    
                    key={id + '-toast'}
                    bg={bgColor}
                    className="d-flex align-items-center w-auto"
                    show={isOpenCustom1}
                    onClose={() =>  {
                      hideCustom1(); 
                      if (onClose) {
                        onClose();
                      }
                    } }
                    delay={15000}
                    autohide
                >
                    <Toast.Body className='text-light'>{text}</Toast.Body>
                    <Button variant="" onClick={() =>  {
                      hideCustom1();
                      if (onClose) {
                        onClose();
                      }
                    }
                      } className="btn-close btn-close-white ms-auto me-2"></Button>
                </Toast>
      </div>
    </ToastContainer>
  )
}
