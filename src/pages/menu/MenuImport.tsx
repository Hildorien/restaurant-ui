import React, { useCallback } from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { Menu, MenuImportProps } from './types'
import { BranchMetadata } from 'redux/branch/types'
import { getMenus } from 'helpers'
import config from 'config/config'
import { Spinner } from 'components'

export const MenuImport = ({ brand, branches, handleSelectBranch, handleSelectMenu}: MenuImportProps) => {
  
    const [selectedBranch, setSelectedBranch] = React.useState<BranchMetadata | undefined>(undefined);
    const [menusFromSourceBranch, setMenusFromSourceBranch] = React.useState<Menu[]>([]);
    const [selectedMenu, setSelectedMenu] = React.useState<Menu| undefined>(undefined);
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
  
    const fetchMenusFromBranch = useCallback(async (branch: BranchMetadata) => {
        await getMenus({ branchId: branch.id})
        .then((response) => {
            const sourceBranchMenus = response.data as Menu[];
            const menusToImport = sourceBranchMenus.filter(menu => menu.brand.id === brand?.id);
            if (menusToImport.length === 0) {
                throw new Error(`No existen menus en la sucursal ${branch.name} para la marca ${brand?.name || ''}`);
            }
            setMenusFromSourceBranch(menusToImport);
        })
        .catch((error) => {
            setMenusFromSourceBranch([]);
            setErrorMessage(error.message);
        });
    }, [brand]);

    const handleSelect = async (eventKey: any) => {
        const branch = (branches || []).find(branch => branch.id === parseInt(eventKey));
        if (branch) {
            setSelectedBranch(branch)
            handleSelectBranch(branch); 
            setLoading(true);
            await fetchMenusFromBranch(branch)
            .finally(() => setLoading(false));
        }
    }

    const handleSelectMenuToImport = (eventKey: any) => {
        const menu = (menusFromSourceBranch || []).find(menu => String(menu.id) === String(eventKey));
        if (menu) {
            setSelectedMenu(menu);
            handleSelectMenu(menu);
        }
    }

    return (
        <div className='text-center'>
                    <h4>Seleccione la sucursal de donde importar el menú para la marca {brand?.name || ''}</h4>
                    <p>Recordá que una vez importado debés seleccionar las apps donde quieras publicarlo.</p>
                    <p className='text-danger'><b>El menú actual será reemplazado por el de la sucursal seleccionada.</b></p>
                    <DropdownButton 
                    variant="primary"
                    onSelect={handleSelect}
                    title={selectedBranch?.name || 'Seleccione una sucursal'}>
                                {(branches || []).map( (branch, index) => {
                                    return(
                                        <Dropdown.Item
                                            key={'Branch-' + branch.id + '-' + index}
                                            href="#" 
                                            eventKey={branch.id} 
                                            active={branch.id === selectedBranch?.id}>
                                            {branch.name}
                                        </Dropdown.Item>
                                    )
                                })
                                }
                    </DropdownButton>
                    {   loading && 
                        <div className='text-center'>
                          <Spinner className="spinner-border my-2" />
                        </ div>
                    }
                    {
                        !loading &&
                        errorMessage &&
                        <p className='text-danger mt-1'><b>{errorMessage}</b></p>
                    }
                    {
                        menusFromSourceBranch.length > 0 &&
                        <>
                        <p className='mt-1'>{`Selecciona el menú de la sucursal elegida:`}</p>
                        <DropdownButton 
                            variant="primary"
                            onSelect={handleSelectMenuToImport}
                            title={ selectedMenu ? `${selectedMenu?.brand.name || ''}-${selectedMenu?.apps.filter(app => app.active).map(app => config.appNames[app.app]).join('-')}` : 'Seleccione un menu'}>
                                        {(menusFromSourceBranch || []).map( (menu, index) => {
                                            return(
                                                <Dropdown.Item
                                                    key={'Menu-' + menu.id + '-' + index}
                                                    href="#" 
                                                    eventKey={menu.id} 
                                                    active={menu.id === selectedMenu?.id}>
                                                    {`${menu.brand.name || ''}-${menu.apps.filter(app => app.active).map(app => config.appNames[app.app]).join('-')}`}
                                                </Dropdown.Item>
                                            )
                                        })
                                        }
                        </DropdownButton>
                        </>
                    }
        </div>
    )
}
