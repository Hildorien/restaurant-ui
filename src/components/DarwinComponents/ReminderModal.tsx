import React, { useEffect, useState } from 'react'
import { useModal } from 'pages/uikit/hooks';
import { Modal, Button } from 'react-bootstrap';
import { ReminderModalProps } from './types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';


const ReminderModal = ({ open, title, text, redirect, confirmButtonText, handleClosure, cssClass, hasCancelButton }: ReminderModalProps) => {
    const { t } = useTranslation();
    const { isOpen, className, toggleModal, openModalWithClass } = useModal();
    const navigate = useNavigate();

    const [requestOpen, setRequestOpen] = useState(false);

    const handleConfirm = () => {
        setRequestOpen(false);
        toggleModal();
        navigate(redirect);
        handleClosure();
    }
    
    
    const handleCancel = () => {
        setRequestOpen(false);
        toggleModal();
        handleClosure();
    }
    
    useEffect(() => {
        if (open && !requestOpen) {
            setRequestOpen(true);
            openModalWithClass(cssClass);
        }
    }, [requestOpen, open, openModalWithClass, cssClass]);

    return (
        <Modal show={isOpen} onHide={handleCancel}>
              <Modal.Header
                  onHide={handleCancel}
                  className={classNames('modal-colored-header', 'bg-' + className)}
              >
              </Modal.Header>
              <Modal.Body>
                    <h4 className="text-center">
                        {t(title) + '.'}
                    </h4>
                    <br></br>
                    <p className="text-center">
                        {t(text) + '.'}
                    </p>
              </Modal.Body>
              <Modal.Footer>
                    {hasCancelButton && 
                        <Button variant="light" onClick={handleCancel}>
                            {t('Cancel')}
                        </Button> 
                    }  
                    <Button variant='primary' onClick={handleConfirm}>
                        {t(confirmButtonText)}
                    </Button>{' '}      
              </Modal.Footer>
        </Modal>
    )
}   

export default ReminderModal;
