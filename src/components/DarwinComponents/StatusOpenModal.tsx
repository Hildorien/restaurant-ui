import { useModal } from 'pages/uikit/hooks';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Modal, Button, Alert } from 'react-bootstrap';
import classNames from 'classnames';
import { Spinner } from 'components';
import LoggerService from 'services/LoggerService';
import { StatusOpenModalProps } from './types';


const StatusOpenModal = (  { open, text, title, handleConfirmOpenModal, handleCancelOpenModal, openErrorMessage, cssClass } : StatusOpenModalProps) => {

    const { t } = useTranslation();
    const { isOpen, className, toggleModal, openModalWithClass } = useModal();
    const [requestOpen, setRequestOpen] = useState(false);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [errorOpening, setErrorOpening] = useState("");
    
    /* Clean up effect */
    useEffect(() => {
        return () => {
            setRequestOpen(false);
            setLoadingRequest(false);
            setErrorOpening("");
          };
    }, []);
    
    useEffect(() => {
        if (open && !requestOpen) {
            setRequestOpen(true);
            openModalWithClass(cssClass);
        }
    }, [requestOpen, open, openModalWithClass, cssClass]);


    const handleConfirm = async () => {
        setLoadingRequest(true);
        handleConfirmOpenModal()
        .then(() => {
            setLoadingRequest(false);
            setRequestOpen(false);
            toggleModal();
        })
        .catch((error: any) => {
            setLoadingRequest(false);
            setErrorOpening(openErrorMessage);
            LoggerService.getInstance().error(error);
        });
    }

    const handleCancel = () => {
        setRequestOpen(false);
        setErrorOpening("");
        setLoadingRequest(false);
        handleCancelOpenModal();
        toggleModal();
    }

    return (
        <Modal show={isOpen} onHide={handleCancel}>
            <Modal.Header
                onHide={handleCancel}
                className={classNames('modal-colored-header', 'bg-' + className)}
            >
            </Modal.Header>
            <Modal.Body>
                {
                    errorOpening && 
                    <div>
                        <Alert variant="danger" className="my-2">
                            {t(errorOpening)}
                        </Alert>
                    </div>
                }
                <h4 className="text-center">
                    {title}
                </h4>
                <br></br>
                <p className="text-center">
                    {text}
                </p>
            </Modal.Body>
            <Modal.Footer>
                    {
                        !loadingRequest ?
                        (<>
                        <Button variant="light" onClick={handleCancel}>
                           {t('Cancel')}
                        </Button>{' '}
                        <Button variant="primary" onClick={handleConfirm}>
                            {t('Confirm')}
                        </Button>
                        </>) :
                        (<div className="text-center">
                        <Spinner className="spinner-border-sm m-2" color={'dark'}/>
                        </div>)
                    }
            </Modal.Footer>
        </Modal>
    
    )

}

export default StatusOpenModal;

