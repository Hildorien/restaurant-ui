import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Printer, PrinterConfig, PrinterFont, PrinterFormData, PrinterModule, PrinterType } from '../types';
import { t } from 'i18next';
import { FormInput, Spinner } from 'components';
import { Button, Card, Col, Row, ToggleButton } from 'react-bootstrap';
import { networkValidation, portValidation, widthValidation } from '../helpers/yupHelpers';
import Switch from "react-switch";
import { GlobalVariablesContext, GlobalVariablesContextType } from 'context/GlobalVariablesProvider';
import { playSound } from 'helpers/sounds';
import useBrands from 'pages/products/hooks/useBrands';
import { Brand } from 'redux/brands/types';
import { createNewPrinterConfig, fromPrintIdsToBrands, getPrintersFromBranchId, parseErrorMessage, parsePrinter, toBrandOptions } from '../helpers/printerHelpers';
import { printerApiStatus } from 'helpers';
import LoggerService from 'services/LoggerService';
import usePrinter from 'hooks/usePrinter';
import { BranchContext, BranchContextType } from 'context/BranchProvider';


const formDefaultValues = {
    id: '',
    name: '',
    nodePrinterName: '',
    printIds: [],
    encoding: '',
    width: undefined,
    font: PrinterFont.A,
    module: PrinterModule.NODEPRINTER,
    type: PrinterType.USB,
    networkAddress: '',
    networkPort: undefined,
    canPrintInvoice: false
}


const validationSchema = yup.object({
    name: yup.string().required(t('Please select a name for the configuration')),
    canPrintInvoice: yup.boolean().optional(),
    /*
    Brands are no longer requiered for now
    printIds: yup.array()
    .when('canPrintInvoice', {
        is: false,
        then: yup.array().min(1, t('Please select at least one brand'))
    }),*/
    networkAddress: networkValidation,
    networkPort:  portValidation,
    encoding: yup.string().required(t('Please type an encoding for printer')),
    width: widthValidation,
  }).required();


export const PrinterSettingsForm2 = () => {
    const errorFocusRef = useRef<HTMLButtonElement>(null);
    const { autoPrint, setAutoPrint, soundNotification, setSoundNotification, soundRepeats, setSoundRepeats  } = useContext(GlobalVariablesContext) as GlobalVariablesContextType;
    const [newPrinterChecked, setNewPrinterChecked] = useState(false);
    const [printersChecked, setPrintersChecked] = useState<boolean[]>([]);

    //Brand info
    const { activeBranchId: activeBranchInfo } = useContext(BranchContext) as BranchContextType;
    const [activeBranch, setActiveBranch] = useState<number | undefined>(undefined);
    const [brands, setBrands] = useState<Brand[]>();
    const { brandInfo, onRequest: onRequestBrands } = useBrands();

    const [brandsUsed, setBrandsUsed] = useState<Brand[]>();

    //Printer List
    const [nodePrinters, setNodePrinters] = useState<string[]>([]);

    const [printers, setPrinters] = useState<Printer[]>([]);
    const [showActionFormError, setShowActionFormError] = useState<string>('');

    const { register, handleSubmit, formState: { errors }, reset, getValues, setValue, control } = useForm<PrinterFormData>({
        resolver: yupResolver(validationSchema)
    });
    const { onRequestNodePrinters, 
        onDeletePrinter, 
        onRequestPrinters, 
        onPrintTestOrder,
        onAddPrinterToConfig,
        onNewPrinterConfig, 
        loading, 
        printerConfig, 
        nodePrinterList, 
        error,
        updatePrinterConfigError,
        updatePrinterConfigSuccess,
        deleteSuccess,
        updatePrinterSuccess,
        onUpdatePrinter } = usePrinter();

    //Input Show states
    const [showConnectionType, setShowConnectionType] = useState(false); //For ESCPOS module
    const [showNetworkIp, setShowNetworkIp] = useState(false); //For ESCPOS module

    const scrollIntoErrorView = useCallback(() => {
        if (errorFocusRef.current) {
            errorFocusRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, []);

    const setErrorMessageOnSubmit = useCallback((message: string) => {
        setShowActionFormError(message);

        //This must go after setShowActionFormError because the error component is in a conditional render that depends on showActionFormError
        scrollIntoErrorView();

    }, [scrollIntoErrorView]);

    //Form Action handlers
    const onSubmit = (data: PrinterFormData) => {
        
        //These validations exceed the context of yup schema validation
        const connType = getValues("type");
        const module = getValues("module");
        if (module === PrinterModule.ESCPOS && connType === PrinterType.NETWORK && (!data.networkAddress || !data.networkPort)) {
            setErrorMessageOnSubmit(t('Network type must have an ip address and port'));
            return;
        }
        const printIds = getValues("printIds");
        /*
        Brands are no longer mandatory
        const canPrintInvoice = getValues("canPrintInvoice")
        if (!canPrintInvoice && printIds && printIds.length === 0) {
            setErrorMessageOnSubmit(t('Please select at least one brand'));
            return;
        }*/
        const nodePrinterName = getValues("nodePrinterName");
        if (module === PrinterModule.NODEPRINTER && !nodePrinterName) {
            setErrorMessageOnSubmit(t('Please select a printer from the system'));
            return;
        }
        const configuredBrands = (brands || []).filter(br => printIds.map(pId => pId.label).includes(br.name));
        setBrandsUsed(prevBrandsUsed =>  {
            const newBrandsUsed = (prevBrandsUsed || []).concat(configuredBrands);
            return newBrandsUsed;
        });
        handleValidFormSubmit(data, printers);
        setNewPrinterChecked(false);
        setPrintersChecked(prev => {
            return prev.map(p => false).slice();
        });
        setShowActionFormError('');
    }

    const handleValidFormSubmit = async (formData: PrinterFormData, currentPrinters?: Printer[]) => {
        const printer: Printer = parsePrinter(formData);
        const printerExists: boolean = (currentPrinters || []).some(p => p.id === printer.id);
        if (!printerExists && currentPrinters && currentPrinters.length > 0) {
            onAddPrinterToConfig(printer);
            return;
        }
        if(printerExists) {
            onUpdatePrinter(printer);
            return;
        }
        const printerConfig: PrinterConfig = createNewPrinterConfig(printer, currentPrinters || []);
        onNewPrinterConfig(printerConfig);
    };

    const handleDeletePrinter = () => {
        const id = getValues("id");
        if (!id) {
            setShowActionFormError(t('You must provide a printer to eliminate it'));
        }
        onDeletePrinter(id);
        setShowActionFormError('');
    }

    const handleNewPrinter = () => {
        reset(formDefaultValues);
        setShowActionFormError('');
        setShowConnectionType(false);
        setShowNetworkIp(false);
    }

    const handlePrintOrderTest = () => {
        /*const printIds = getValues("printIds");
        if (printIds.length === 0) {
            setShowActionFormError(t('You must provide a printer to print an order test'))
        }*/
        // We do not care about the printId for testing
        onPrintTestOrder("1-1");
    }

    //Printer click handler
    const handlePrinterConfigClick = (printer: Printer) => {
        const brandOptions = toBrandOptions(brands || [], activeBranchInfo);
        const configuredBrands = brandOptions.filter(br => printer.printIds.includes(br.value));
        let printerFormData: PrinterFormData = {
            id: printer.id,
            name: printer.name,
            printIds: configuredBrands,
            module: printer.module,
            type: printer.type,
            encoding: printer.encoding,
            width: printer.width,
            font: printer.font,
            canPrintInvoice: printer.canPrintInvoice
        }
        if (printer.networkConfig) {
            printerFormData.networkAddress = printer.networkConfig.address;
            printerFormData.networkPort = printer.networkConfig.port;
        }
        if (printer.nodePrinterName) {
            printerFormData.nodePrinterName = printer.nodePrinterName;
        }
        setValue("id", printerFormData.id);
        setValue("name", printerFormData.name);
        setValue("nodePrinterName", printerFormData.nodePrinterName);
        setValue("printIds", printerFormData.printIds);
        setValue("encoding", printerFormData.encoding);
        setValue("width", printerFormData.width);
        setValue("font", printerFormData.font);
        setValue("module", printerFormData.module);
        setValue("type", printerFormData.type);
        setValue("networkAddress", printerFormData.networkAddress);
        setValue("networkPort", printerFormData.networkPort);
        setValue("nodePrinterName", printerFormData.nodePrinterName);
        setValue("canPrintInvoice", printerFormData.canPrintInvoice);
        setShowConnectionType(printerFormData.module === PrinterModule.ESCPOS);
        setShowNetworkIp(printerFormData.type === PrinterType.NETWORK);
        setShowActionFormError('');
    }

    //When branch changes, fetch new info
    useEffect(() => {
        if (activeBranch !== activeBranchInfo) {

            const checkAPIStatus = async () => {
                await printerApiStatus();
            }
            checkAPIStatus()
            .then() //Health check is OK
            .catch((error) => {
                setShowActionFormError(t('Printer service is offline. Please restart application'))
                LoggerService.getInstance().error(error);
            });
            onRequestPrinters();
            onRequestBrands(activeBranchInfo);
            onRequestNodePrinters();
            setActiveBranch(activeBranchInfo);
        }
      }, [activeBranch, activeBranchInfo, onRequestPrinters, onRequestBrands, onRequestNodePrinters]);

    //Render printer config every time it changes
    useEffect(() => {
        if (printerConfig) {
            setPrinters(getPrintersFromBranchId(printerConfig?.printers || [], activeBranchInfo));
            setPrintersChecked((printerConfig.printers || []).map(pr => {
                return false;
            }))
        }
        if (brands) {
            const brandsUsed = fromPrintIdsToBrands((printerConfig?.printers || []).map(pr => pr.printIds).flat(), brands || []);
            setBrandsUsed(brandsUsed);
        }
    }, [printerConfig, activeBranchInfo, brands]);

    //Effect after submitting form and printer-server responded OK
    useEffect(() => {
        if (updatePrinterConfigSuccess) {
            onRequestPrinters();
            reset(formDefaultValues);
        }
    }, [updatePrinterConfigSuccess, reset, onRequestPrinters]);

    useEffect(() => {
        if (deleteSuccess) {
            onRequestPrinters();
            const printIds = getValues("printIds");
            setBrandsUsed(prevBrandsUsed => {
                //Calcualte the difference between the brandsUsed and the brands that used the form that is being deleted
                //This will make available the brands that the config used
               const newBrandsUsed = (prevBrandsUsed || []).filter(prevB => printIds.map(pId => pId.label).includes(prevB.name));
               return newBrandsUsed;
            });
            reset(formDefaultValues);
        }
    }, [onRequestPrinters, deleteSuccess, reset, getValues]);

    useEffect(() => {
        if (updatePrinterSuccess) {
            onRequestPrinters();
            reset(formDefaultValues);
        }
    }, [updatePrinterSuccess, onRequestPrinters, reset])

    //Effect for errors with printer server
    useEffect(() => {
        if (error) {
            LoggerService.getInstance().error(error);
            const printerName = getValues("name") || '';
            const printerModule = getValues("module");
            const errorMessage = parseErrorMessage(error, printerName, printerModule);
            setErrorMessageOnSubmit(errorMessage)
        }
    }, [error, getValues, setErrorMessageOnSubmit]);

    //If there is an error updating the config, make sure to release the brands used in the form
    useEffect(() => {
        if (updatePrinterConfigError) {
            const printIds = getValues("printIds");
            setBrandsUsed(prevBrandsUsed => {
                //Calcualte the difference between the brandsUsed and the brands that used the form that is being deleted
                //This will make available the brands that the config used
               const newBrandsUsed = (prevBrandsUsed || []).filter(prevB => !printIds.map(pId => pId.label).includes(prevB.name));
               return newBrandsUsed;
            });
        }
    }, [updatePrinterConfigError, getValues]);

    //Effect for brands
    useEffect(() => {
        if (brandInfo) {
            setBrands(brandInfo);
        }
    }, [brandInfo]);

    //Effect for nodePrinterList
    useEffect(() => {
        if (nodePrinterList) {
            setNodePrinters(nodePrinterList.map( (np: any) => np.name));
        }
    }, [nodePrinterList]);

    return (
        <Card>
            <Card.Body>

            <Row className='my-2' lg={4}>
            <Col>
            <h5>{t('Auto print')}</h5>
            </Col>
            <Col>
            <Switch
                    className="react-switch"
                    checked={autoPrint}
                    onChange={(e: any) => {
                        setAutoPrint(!autoPrint);
                    }}
            />
            </Col>
            </Row>
            <Row className='my-2' lg={4}>
            <Col>
            <h5>{t('Activate sound notification')}</h5>
            </Col>
            <Col>
            <Switch
                    className="react-switch"
                    checked={soundNotification}
                    onChange={ async (e: any) => {
                        if (!soundNotification) {
                            playSound();
                        }
                        setSoundNotification(!soundNotification);
                    }}
            />
            </Col>
            </Row>
            <Row className='my-2' lg={4}>
            <Col>
            <h5>{t('Sound repetitions')}</h5>
            </Col>
            <Col>
            <input type="number" className="form-control" style={{'width': '25%'}}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const inputValue = parseInt(event.target.value);
                if (!isNaN(inputValue)) {
                    setSoundRepeats(inputValue);
                }
            }}
            value={soundRepeats}/>
            </Col>
            </Row>
            <br></br>
            <div>
                <h5>Impresoras configuradas:</h5>
                <div className="button-list">
                {
                    printers.length === 0 &&
                    <p className='text-center text-muted'>{t('There are no printers configured at the moment, please fill out the form below to start using a printer')}</p>
                }
                { !loading &&
                    printers.map((printerConfig, index) => {
                    return (
                        <ToggleButton
                        key={index.toString()}
                        className="mb-2"
                        id={"toggle-check-printer" + printerConfig.id}
                        type="checkbox"
                        variant="outline-primary"
                        checked={printersChecked[index]}
                        value={printerConfig.id}
                        onChange={(e) => {
                            handlePrinterConfigClick(printerConfig);
                            setPrintersChecked(prev => {
                                let newState = prev.slice().map(p => false);
                                newState[index] = !printersChecked[index];
                                return newState;
                            });
                            if (newPrinterChecked){
                                setNewPrinterChecked(false);
                            }
                        }}
                        >{printerConfig.name || ''}</ToggleButton>
                    );
                })
                }
                { loading &&
                     <div className='text-center'>
                     <Spinner className="m-2" color='secondary' />
                     </div>
                }
                </div>
            </div>
            <hr></hr>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='my-2'>
                    <ToggleButton
                        className="mb-2"
                        id="toggle-check-new-printer"
                        type="checkbox"
                        variant="outline-success"
                        checked={newPrinterChecked}
                        value="1"
                        onChange={(e) => {
                            handleNewPrinter();
                            setNewPrinterChecked(e.currentTarget.checked);
                            if (printersChecked){
                                setPrintersChecked(prev => {
                                    const allFalse = prev.map(pr => { return false });
                                    return allFalse.slice();
                                });
                            }
                        }}
                        >{t('New printer')}</ToggleButton>
                </div>
            { ( newPrinterChecked || printersChecked.some(pr => pr)) &&
                <>
                <Row>
                    <Col>
                        <FormInput
                                label={t('Name') + ' *'}
                                key="name"
                                type="text"
                                name="name"
                                register={register}
                                placeholder={t('Enter the name of the configuration')}
                                containerClass={'mb-3'}
                                errors={errors}
                        />
                        
                        <FormInput
                            label={t('Select a brand for the printer')}
                            key="printIds"
                            type="multipleselect"
                            name="printIds"
                            register={register}
                            errors={errors}
                            placeholder={'Brand...'}
                            containerClass={'mb-3'}
                            control={control}
                            multiSelectOptions={toBrandOptions(
                                (brands || []).filter(br => !(brandsUsed || []).includes(br))
                                , activeBranchInfo)}
                        />

                        <FormInput
                                label={t('Encoding') + ' *'}
                                key="encoding"
                                type="text"
                                name="encoding"
                                register={register}
                                placeholder={t('Enter the name encoding of the printer')}
                                containerClass={'mb-3'}
                                errors={errors}
                        />

                        <FormInput
                            label={t('Width')}
                            key="width"
                            type="number"
                            name="width"
                            register={register}
                            placeholder={t('Enter the width of the printer (between 20 and 100)')}
                            containerClass={'mb-3'}
                            errors={errors}
                        />

                        <FormInput
                            label={t('Is invoice printer')}
                            key="canPrintInvoice"
                            type="checkbox"
                            name="canPrintInvoice"
                            register={register}
                            containerClass={'mb-3'}
                            errors={errors}
                        />

                    </Col>
                    <Col>
                        <FormInput
                            label={t('Printer font type')}
                            type="select"
                            name="font"
                            key="font"
                            register={register}
                            errors={errors}
                            containerClass={'mb-3'}
                            >
                            {
                                Object.values(PrinterFont).map( (value: PrinterFont) => {
                                    return (<option key={value.toString()}>{value}</option>)
                                })
                            }
                        </FormInput>

                        <FormInput
                        label={t('Module') + ' *'}
                        type="select"
                        name="module"
                        key="module"
                        register={register}
                        errors={errors}
                        containerClass={'mb-3'}
                        onChange={(e) => {
                            setShowConnectionType(e.target.value === PrinterModule.ESCPOS);
                        }}
                        >
                        {
                            Object.values(PrinterModule).map( (value: PrinterModule) => {
                                return (<option key={value.toString()}>{value}</option>)
                            })
                        }
                        </FormInput>

                        { showConnectionType ?
                        (<FormInput
                                label={t('Connection type')}
                                type="select"
                                key="type"
                                name="type"
                                register={register}
                                containerClass={'mb-3'}
                                errors={errors}
                                onChange={(e) => {
                                    setShowNetworkIp(e.target.value === PrinterType.NETWORK);
                                }}
                                >
                                {
                                    Object.values(PrinterType).map( (value: PrinterType) => {
                                        return (<option key={value.toString()}>{value}</option>)
                                    })
                                }
                        </FormInput>) :
                        ( //This means that NODEPRINTER module was selected. Therefore we show the nodePrinterList selector instead
                        <FormInput
                                label={t('Select a printer from the system') + ' *'}
                                type="select"
                                key="nodePrinterName"
                                name="nodePrinterName"
                                register={register}
                                containerClass={'mb-3'}
                                errors={errors}
                                >
                                {
                                    nodePrinters.map( (value: string) => {
                                        return (<option key={value}>{value}</option>)
                                    })
                                }
                        </FormInput>
                        )
                        }
                        { showNetworkIp && showConnectionType &&
                        <Row>
                            <Col>
                                <FormInput
                                label={t('Ip Address')}
                                key="networkAddress"
                                type="text"
                                name="networkAddress"
                                register={register}
                                errors={errors}
                                placeholder={t('192.168.1.1')}
                                containerClass={'mb-3'}
                                />
                            </Col>
                            <Col>
                                <FormInput
                                label={t('Port')}
                                type="number"
                                name="networkPort"
                                key="networkPort"
                                register={register}
                                errors={errors}
                                placeholder={t('6001')}
                                containerClass={'mb-3'}
                                />
                            </Col>
                        </Row>
                        }
                    </Col>
                </Row>
                <Button variant="primary" className='ms-3 my-2' type="submit">{t('Confirm')}</Button>
                <Button variant="primary" className='ms-3 my-2' onClick={handlePrintOrderTest}>{t('Print test order')}</Button>
                <Button variant="danger" className='ms-3 my-2' onClick={handleDeletePrinter}>{t('Delete printer')}</Button>
                </>
            }
            </form>

            </Card.Body>
            {
                showActionFormError &&
                <Card.Footer>
                    <Button variant="link" className='ms-3 my-2 text-danger' disabled ref={errorFocusRef}>{showActionFormError}</Button>
                </Card.Footer>
            }

        </Card>
      );
}
