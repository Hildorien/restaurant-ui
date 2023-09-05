import { t } from "i18next";
import { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import SimpleBar from 'simplebar-react';
import { PaymentMethod, parsePaymentMethod } from "./helpers";

interface CounterSalePaymentMethodProps {
    handlePaymentSelect: (payment: PaymentMethod) => void;
}

export const CounterSalePaymentMethod = ({ handlePaymentSelect }: CounterSalePaymentMethodProps) => {

    const [activePayment, setActivePayment] = useState<PaymentMethod>(PaymentMethod.CASH);

    const payments = [ PaymentMethod.CASH, PaymentMethod.CREDIT_CARD, PaymentMethod.VIRTUAL_WALLET]

    const handleSelect = (key: any, event: Object) => {
        setActivePayment(key);
        handlePaymentSelect(key);
    }

    return (
        <DropdownButton variant="light" 
            title={activePayment === undefined ? 
                t('Select a payment method') :                         
                parsePaymentMethod(activePayment)} onSelect={handleSelect}>
        <SimpleBar autoHide={false} style={{maxHeight: '200px', 'width': '240px'}}>
        {payments.map( (payment, index) => {
           return (<Dropdown.Item
                    key={index}
                    href="#" eventKey={payment} active={payment === activePayment}
                    >
                        {parsePaymentMethod(payment)}
                </Dropdown.Item>)
          })}
        </SimpleBar>
      </DropdownButton>
    )
}