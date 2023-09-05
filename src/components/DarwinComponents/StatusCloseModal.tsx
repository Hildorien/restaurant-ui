import useModal from 'pages/uikit/hooks/useModal';
import React, { useEffect, useState } from 'react'
import { Modal, Dropdown, DropdownButton, Button, Alert } from 'react-bootstrap';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'components';
import LoggerService from 'services/LoggerService';
import { StatusCloseModalProps } from './types';
import { StoreCloseReasonParser, StoreClosedReason } from 'config/types';


const StatusCloseModal = ({ open, text, title, closeReasons, handleConfirmCloseModal, handleCancelCloseModal, closeErrorMessage, cssClass } : StatusCloseModalProps) => {

    const { t } = useTranslation();
    const { isOpen, className, toggleModal, openModalWithClass } = useModal();
    const [active, setActive] = useState<StoreClosedReason | undefined>(undefined);
    const [requestOpen, setRequestOpen] = useState(false);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [errorClosing, setErrorClosing] = useState("");
    const [showOtherReasonDesc, setShowOtherReasonDesc] = useState(false);
    const [otherReasonDescription, setOtherReasonDescription] = useState("");


    /* Clean up effect */
    useEffect(() => {
        return () => {
            setActive(undefined);
            setRequestOpen(false);
            setLoadingRequest(false);
            setErrorClosing("");
          };
    }, []);
    
    useEffect(() => {
        if (open && !requestOpen) {
            setRequestOpen(true);
            openModalWithClass(cssClass);
        }
    }, [requestOpen, open, openModalWithClass, cssClass]);

    const handleSelect = (key: any, event: Object) => {
        setActive(key);
        setShowOtherReasonDesc(key === StoreClosedReason.OTHER);
    }
    

    const handleConfirm = async () => {
        if (active === undefined) {
            setErrorClosing('Choose a reason');
        } else if (active === StoreClosedReason.OTHER && otherReasonDescription.trim().length === 0) {
            setErrorClosing('Briefly describe the reason');
        } else {
            setLoadingRequest(true);
            handleConfirmCloseModal(active, otherReasonDescription)
            .then(() => {
                setLoadingRequest(false);
                setRequestOpen(false);
                setActive(undefined);
                toggleModal();
            })
            .catch((error: any) => {
                setLoadingRequest(false);
                setErrorClosing(closeErrorMessage);
                LoggerService.getInstance().error(error);
            });
        }
    }

    const handleCancel = () => {
        setActive(undefined);
        setErrorClosing("");
        setLoadingRequest(false);
        setRequestOpen(false);
        setOtherReasonDescription("");
        setShowOtherReasonDesc(false);
        handleCancelCloseModal();
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
                    errorClosing && 
                    <div>
                        <Alert variant="danger" className="my-2">
                            {t(errorClosing)}
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
                <p className="text-center">
                    {t('Tell us the reason')}
                </p>
                <div className="text-center">
                  <DropdownButton variant="light" title={active === undefined ? t('Close reason') : t(StoreCloseReasonParser.parse(active))} onSelect={handleSelect}>
                    {closeReasons.map( (reason, index) => {
                       return (<Dropdown.Item key={index}
                        href="#" eventKey={reason} active={reason===active} >{t(StoreCloseReasonParser.parse(reason))}</Dropdown.Item>)
                      })}
                  </DropdownButton>
                </div>
                {
                    showOtherReasonDesc && 
                    (<div className="text-center mt-2">
                        <input type="text" 
                            maxLength={50}
                            className="form-control" 
                            placeholder={t('Briefly describe the reason') + "..."} 
                            value={otherReasonDescription}
                            onChange={(e) => setOtherReasonDescription(e.target.value)}
                        />
                    </div>)
                }

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

export default StatusCloseModal;
