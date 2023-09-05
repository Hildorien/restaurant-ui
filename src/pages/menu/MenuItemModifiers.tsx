import { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Dropdown, DropdownButton, Offcanvas, Table } from 'react-bootstrap'
import { MenuModifierGroup, MenuItemModifiersProps } from './types'
import { t } from 'i18next'
import { useToggle } from 'hooks'
import { MenuItemModifierOptions } from './MenuItemModifierOptions'
import { getModifierGroups } from 'helpers/api/menu'
import { BranchContext, BranchContextType } from 'context/BranchProvider'
import LoggerService from 'services/LoggerService'

export const MenuItemModifiers = ({ menuItem , disabled, onMenuItemModifiersChange }: MenuItemModifiersProps) => {
      
    //Import hooks
    const [isOpen, toggle] = useToggle();
    const { activeBranchId } = useContext(BranchContext) as BranchContextType;

    //Local variables
    const [checkingModifiers, setCheckingModifiers] = useState(false);
    const [modifiersOfProduct, setModifiersOfProduct] = useState<MenuModifierGroup[]>(menuItem.modifierGroups || []);
    const [selectedModifiers, setSelectedModifiers] = useState<MenuModifierGroup[]>(menuItem.modifierGroups || []);
    const [lastModifierSelected, setLastModifierSelected] = useState<MenuModifierGroup | undefined>(undefined);
    const [modifierToEdit, setModifierToEdit] = useState<MenuModifierGroup | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string>("");

    //Handlers
    const handleEditModifier = (modifier: MenuModifierGroup) => {
        setModifierToEdit(modifier);
        toggle();
    }

    const handleDeleteModifier = (modifier: MenuModifierGroup) => {
        setModifierToEdit(undefined);
        const filterModifiers = selectedModifiers.filter(mod => mod.groupId !== modifier.groupId);
        const newModifiers = filterModifiers.map( (group, index) => {
            return { ...group, position: index }
        });
        setSelectedModifiers(newModifiers);
        onMenuItemModifiersChange({ ...menuItem, modifierGroups: newModifiers })
    }

    const handleSelect = (eventKey: any) => {
        setLastModifierSelected(eventKey);
        const oldModifiers = selectedModifiers.slice();
        const newModifier = modifiersOfProduct.find(modifier => modifier.groupId.toString() === eventKey);
        if (newModifier && selectedModifiers.filter(mod => mod.groupId.toString() === eventKey).length > 0) {
            setErrorMessage(`El modificador "${newModifier.name}" ya está agregado en el producto`);
            return;
        }
        if (newModifier) {
            oldModifiers.push(newModifier);
        }
        setErrorMessage('');
        const newModifiers = oldModifiers.map( (group, index) => {
            return { ...group, position: index }
        });
        setSelectedModifiers(newModifiers);
        onMenuItemModifiersChange({ ...menuItem, modifierGroups: newModifiers });
    }

    const onRequestEditedGroup = (modifierGroup: MenuModifierGroup): void => {
        setModifierToEdit(modifierGroup);
        const oldModifiers = selectedModifiers.slice();
        const editedModifiers = oldModifiers.map(mod => {
            if (mod.groupId === modifierGroup.groupId) {
                return modifierGroup;
            }
            return mod;
        })
        const newModifiers = editedModifiers.map( (group, index) => {
            return { ...group, position: index }
        });
        setSelectedModifiers(newModifiers);
        onMenuItemModifiersChange({ ...menuItem, modifierGroups: newModifiers })
        toggle();  
    }

    const onRequestCancelEdit = () => {
        toggle();
    }

    const fetchModifiers = useCallback(async () => {
        await getModifierGroups({ branchId: activeBranchId, productId: menuItem.product.id })
        .then((response) => {
            const modifiers = response.data as MenuModifierGroup[];
            setModifiersOfProduct(modifiers);
        })
        .catch((error) => {
            LoggerService.getInstance().error(error);
        });

    }, [menuItem, activeBranchId])

    //Effects
    useEffect(() => {
        if (disabled) {
            setCheckingModifiers(false);
        } else {
            setCheckingModifiers(true);
        }
    }, [disabled]);
    
    useEffect(() => {
        if (!disabled) {
            fetchModifiers();
        }
    }, [disabled, fetchModifiers]);

    useEffect(() => {
        if (errorMessage.length > 0) {
            //Clean error message after 3 seconds
            setTimeout(() => {
                setErrorMessage("");
            }, 3000)
        }
    } ,[errorMessage]);

    //Whenever modifiersGroups from parent changes, update local list of modifier groups
    useEffect(() => {  
        const updatedModifiers = menuItem.modifierGroups || []
        setSelectedModifiers(updatedModifiers);
        setModifiersOfProduct(updatedModifiers);
    }, [menuItem.modifierGroups])

    return (
        <>

        {   disabled && selectedModifiers.length > 0 &&
            <p className='my-1 text-muted'><b>Modificadores elegidos: </b>{selectedModifiers.map(mod => mod.name || '').join(", ")}</p>
        }
        {
            checkingModifiers && modifiersOfProduct.length > 0 &&
            <>
            <DropdownButton size='sm' variant="primary" className='mt-2' title={t('Add a modifier group')} onSelect={handleSelect}>
                    {modifiersOfProduct.map( (modifier, index) => {
                       return (<Dropdown.Item key={index}
                        href="#" eventKey={modifier.groupId} active={modifier===lastModifierSelected} >{modifier.name || ''}</Dropdown.Item>)
                      })}
            </DropdownButton>
            {errorMessage && <p className='text-danger my-2'>{errorMessage}</p>}
            <Table size='sm'>
                <thead></thead>
                <tbody>
                {(selectedModifiers || []).map( (modifier: MenuModifierGroup, index: number) => {
                    return (                                                
                    <tr key={index.toString()} style={{borderBottom: '1px solid #ddd'}}>
                       <td className='p-0'>{modifier.name || ''}</td>
                       <td className='p-0'>
                       <Button className="btn-icon me-1 my-1" variant="outline-danger" onClick={() => handleDeleteModifier(modifier)}>
                            <i className="mdi mdi-trash-can" title={t('Delete')}></i>
                        </Button>
                        <Button className="btn-icon my-1" variant="outline-primary" onClick={() => handleEditModifier(modifier)}>
                            <i className="mdi mdi-pencil" title={t('Edit')}></i>
                        </Button>                        
                        </td>

                    </tr>
                    )})}
                </tbody>
            </Table>
            <Offcanvas show={isOpen}
                    onHide={toggle} 
                    key={"ModifierEdit"}
                    backdrop={true}
                    scroll={true}
                    keyboard={true}
                    className={'w-50 mt-5'}
                    placement='end'>
                    <Offcanvas.Header closeButton>
                            <Offcanvas.Title>
                                <h2>{modifierToEdit?.name || ''}</h2>
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                           <MenuItemModifierOptions 
                            modifierGroup={modifierToEdit} 
                            onRequestEditedGroup={onRequestEditedGroup}
                            onRequestCancelEdit={onRequestCancelEdit}
                            />

                        </Offcanvas.Body>
            </Offcanvas>
            </>
        }
        </>
  )
}
