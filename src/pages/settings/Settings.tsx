import { DarwinAccordionRow } from 'components/DarwinComponents/DarwinAccordionRow';
import { DarwinSectionTitle } from 'components/DarwinComponents/DarwinSectionTitle';
import { t } from 'i18next';
import { useState } from 'react';
import { Accordion } from 'react-bootstrap';
import { PrinterSettingsForm2 } from './printer/PrinterSettingsForm2';


const Settings = () => {

    const [activeAccordions, setActiveAccordions] = useState<string[]>([]);

    const handleClickOnAccordion = (id: string) => {
        let prevActiveAccordions = activeAccordions.slice();
        if (!prevActiveAccordions.includes(id)) {
            prevActiveAccordions.push(id);
        } else {
            // If we click on an open accordion, close it.
            prevActiveAccordions = prevActiveAccordions.filter(acc => acc !== id);
        }
        setActiveAccordions(prevActiveAccordions);
    }

    return (
        <>     
            <DarwinSectionTitle title={t('Restaurant configuration')}/>
            <Accordion activeKey={activeAccordions} id="accordion-settings" className="custom-accordion" alwaysOpen={true}>
                <DarwinAccordionRow
                index={0}
                item={ {id: 0, title: t('Printer settings')} }
                isActive={activeAccordions.includes('0')}
                handleClickOnAccordion={() => handleClickOnAccordion(String(0))}
                content={<PrinterSettingsForm2 />}     
                />
            </Accordion>
        </>
    )
}

export default Settings;
