import { MenuModifierGroup, MenuModifierOption, MenuItemModifierOptionsProps } from './types'
import { Button, Card } from 'react-bootstrap'
import { MenuItemModifierOptionsTable } from './MenuItemModifierOptionsTable'
import { useState } from 'react';

export const MenuItemModifierOptions = ({ modifierGroup, onRequestEditedGroup, onRequestCancelEdit }: MenuItemModifierOptionsProps) => {
    
    const [modiferGroupEdited, setModifierGroupEdited] = useState<MenuModifierGroup | undefined>(modifierGroup);

    const onRequestEditedOptions = (options: MenuModifierOption[]) => {
        if (modiferGroupEdited) {
            const newModifier: MenuModifierGroup = {...modiferGroupEdited, options: options};
            setModifierGroupEdited(newModifier);
        }
    }

    const handleConfirm = () => {
        if (modiferGroupEdited) {
            onRequestEditedGroup(modiferGroupEdited);
        }
    }

    const handleCancel = () => {
        onRequestCancelEdit();
    }

    
    return (
        <Card>
            <Card.Header>
                Mínimo: {modifierGroup?.minQty || 0} - Máximo: {modifierGroup?.maxQty || 0}
            </Card.Header>
            <Card.Body>
                <MenuItemModifierOptionsTable
                    onRequestEditedOptions={onRequestEditedOptions}
                    options={modifierGroup?.options || []} />
            </Card.Body>
            <Card.Footer>
                <div style={{float: 'right'}}>
                    <Button variant='primary' className='my-2' onClick={handleConfirm}>Confirmar</Button>
                    <Button variant='danger' onClick={handleCancel} className='my-2 mx-2'>Cancelar</Button>
                </div>
            </Card.Footer>
        </Card>
  )
}
