import { DarwinSectionTitle } from 'components/DarwinComponents/DarwinSectionTitle';
import { t } from 'i18next';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Accordion, Button, Card, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import { MenuAccordionRow } from './MenuAccordionRow';
import { MenuApp, MenuSection, Menu, MenuBrand, MenuAccordionItem, MenuActionMessage, PublishStatus } from './types';
import MenuCard from './MenuCard';
import { BranchContext, BranchContextType } from 'context/BranchProvider';
import { createMenu, deleteMenu, getApps, getMenus, publishMenu, updateMenu } from 'helpers/api/menu';
import { getBrandsByBranchId } from 'helpers';
import { Brand } from 'redux/brands/types';
import { Spinner } from 'components';
import { arrayEquals } from 'utils';
import { useModal } from 'pages/uikit/hooks';
import classNames from 'classnames';
import LoggerService from 'services/LoggerService';
import { MenuImport } from './MenuImport';
import { BranchMetadata } from 'redux/branch/types';
import { BrandContext, BrandContextType } from 'context/BrandProvider';
import { useUser } from 'hooks';
import { Role } from 'config/types';
import { removeIdsFromMenu, sortMenus } from './utils';
import config from 'config/config';

const MenuDashboard = () => {

  //Local state variables
  const [menuActionMessage, setMenuActionMessage] = useState<MenuActionMessage |undefined>(undefined);
  const [menuErrorMessage, setMenuErrorMessage] = useState<string>("");

  //Menus that are shown on the accordion
  const [brandMenus, setBrandMenus] = useState<Menu[]>([]);

  //Menus that are not yet created that consists of brands that have not associated an app yet
  const [potentialMenus, setPotentialMenus] = useState<Menu[]>([]);
  
  const [activeAccordions, setActiveAccordions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  //const [requestingMenus, setRequestingMenus] = useState<boolean>(false);
  const [showPotentialAvailableMenus, setShowPotentialAvailableMenus] = useState<boolean>(false);
  
  //Import Menu feature
  const [branchToImportFrom, setBranchToImportFrom] = useState<BranchMetadata | undefined>(undefined);
  //Source menu is from other branch
  const [sourceMenu, setSourceMenu] = useState<Menu | undefined>(undefined);
  //Destination menu is from current branch
  const [destinationMenu, setDestinationMenu] = useState<Menu | undefined>(undefined);

  //Import hooks
  const { activeBranchId } = useContext(BranchContext) as BranchContextType;
  const { isOpen: isWarningModalOpen, className: warningModalclassName, toggleModal: toggleWarningModal, openModalWithClass: openWarningModalWithClass } = useModal();
  const { isOpen: isImportModalOpen, className: importModalclassName, toggleModal: toggleImportModal, openModalWithClass: openImportModalWithClass } = useModal();
  const { brands: brandInfo } = useContext(BrandContext) as BrandContextType;
  const { branches } = useContext(BranchContext) as BranchContextType;
  const [loggedInUser] = useUser();

  
  //Callback function to fetch data for rendering dashboard
  const fetchMenus = useCallback(async () => {
    let persistedMenus: Menu[] = [];
    await getMenus({ branchId: activeBranchId})
    .then( async (response) => {
      persistedMenus = response.data as Menu[];
      let potentialMenus: Menu[] = [];
      if (persistedMenus.length === 0) {

        //If no menus are persisted, create one for each brand with all apps
        let menuBrands: MenuBrand[] = [];
        await getBrandsByBranchId({ branchId: activeBranchId})
        .then(async (response) => {
          const brands = response.data as Brand[];
          menuBrands = brands.map(brand => {
            return {
              id: brand.id,
              name: brand.name,
            }
          });
          for (let brand of menuBrands) {
            await getApps({ branchId: activeBranchId, brandId: brand.id})
            .then(async (response) => {
              const apps = response.data as MenuApp[];
              const potentialMenu: Menu = {
                sections: [],
                apps: apps,
                brand: brand
              }
              potentialMenus.push(potentialMenu);
            })
          }
          //Just set menus as all potential menus
          setBrandMenus(sortMenus(potentialMenus));
        })

      } else {

        //If menus are persisted we need to do two things: 
        // 1. Create potential menus with the remaining combination of brand-apps that are not persisted
        // 2. Create potential menu with brands that are not used
        // 3. Remove apps from persisted menus that are persisted in other menus with the same brand 
        
        //Create potential menus
        const menusWithInactiveApps = persistedMenus.filter(menu => menu.apps.some(app => !app.active));
        let potentialMenus: Menu[] = [];
        for (const menu of menusWithInactiveApps) {
          const inactiveApps = menu.apps.filter(app => !app.active);
          const potentialMenu: Menu = {
            sections: [],
            apps: inactiveApps,
            brand: menu.brand
          }
          const menuAlreadyAdded = (menus: Menu[], m: Menu) => {
            return menus
              .filter(menu => 
                menu.brand.id === m.brand.id && 
                arrayEquals(menu.apps, m.apps)).length > 0;
          }
          if (potentialMenus.length === 0 ||
            (potentialMenus.length > 0 && 
              menuAlreadyAdded(potentialMenus, potentialMenu))) {
            potentialMenus.push(potentialMenu);
          }
        }

        //Remove inactive apps from persistedMenus that are active in other menus with the same brand
        for(const menu of persistedMenus) {
          for (const otherMenu of persistedMenus) {
            if (menu.id !== otherMenu.id && menu.brand.id === otherMenu.brand.id) {
              const currMenuActiveApps = menu.apps.filter(app => app.active);
              const currMenuInactiveApps = menu.apps.filter(app => !app.active);
              const otherMenuInactiveApps = otherMenu.apps.filter(app => !app.active);
              const appsToKeep = currMenuInactiveApps
              .filter( app =>  
                otherMenuInactiveApps
                .filter(app2 => app2.app === app.app).length > 0);

              menu.apps = currMenuActiveApps.concat(appsToKeep);
            }
          }
        }
        
        // Create potential menu with brands that are not used 
        let menuBrands: MenuBrand[] = [];
        let menusWithUnusedBrands: Menu[] = [];
        const brands = (await getBrandsByBranchId({ branchId: activeBranchId})).data as Brand[];
        if (!brands) {
          throw new Error('Error al leer las marcas');
        }
        menuBrands = brands.map(brand => {
          return {
            id: brand.id,
            name: brand.name,
          }
        });
        let menusToShow = persistedMenus.concat(potentialMenus).slice();
        const menusOfUnusedBrands = menuBrands.filter(b => !(menusToShow.map(m => m.brand.id).includes(b.id)));
        for (let brand of menusOfUnusedBrands) {
          await getApps({ branchId: activeBranchId, brandId: brand.id})
          .then(async (response) => {
            const apps = response.data as MenuApp[];
            const potentialMenu: Menu = {
              sections: [],
              apps: apps,
              brand: brand
            }
            menusWithUnusedBrands.push(potentialMenu);
          })
        }
        menusToShow = persistedMenus.concat(menusWithUnusedBrands).slice();
        setBrandMenus(sortMenus(menusToShow));


        let filteredPotentialMenus = [];
        for (const menu of potentialMenus) {
          const persistedMenuActiveApps = persistedMenus.filter(m => m.brand.id === menu.brand.id).map(m => m.apps.filter(app => app.active)).flat();
          menu.apps = menu.apps.filter(app => persistedMenuActiveApps.filter(app2 => app2.app === app.app).length === 0).slice();
          if (menu.apps.length > 0) {
            filteredPotentialMenus.push(menu);
          }
        }
        setPotentialMenus(filteredPotentialMenus);
      }
    })
    .catch((error) => {
      LoggerService.getInstance().error(error);
      setMenuActionMessage({ message: 'Error al leer los menus', class: 'danger'})
    })
    .finally(() => { 
      setLoading(false);
    });
  },[activeBranchId]);

  //Event Handlers

  //Handlers for Accordion actions  
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

  const handleImport = (item: MenuAccordionItem) => {
    const menu: Menu = {
      id: item.menuId,
      sections: item.sections.slice(),
      brand: item.brand,
      apps: item.apps.slice()
    }
    setDestinationMenu(menu);
    openImportModalWithClass('primary');
  }

  const handleDuplicate = (item: MenuAccordionItem) => {
    let newMenus: Menu[] = brandMenus.slice();
    let duplicatedMenu: Menu = {
      sections: item.sections.slice(),
      apps: item.apps.filter(app => !app.active).slice(),
      brand: { id: item.brand.id, name: item.brand.name },
    }
    newMenus.push(duplicatedMenu);
    setBrandMenus(sortMenus(newMenus));
    setMenuActionMessage({ message: 'Menu copiado con éxito', class: 'success'});
  }

  const handleDeleteMenu = async (item: MenuAccordionItem) => {
    const menu: Menu = {
      id: item.menuId,
      sections: item.sections.slice(),
      brand: item.brand,
      apps: item.apps.slice()
    }
    setLoading(true);
    await deleteMenu(activeBranchId, item.brand.id, menu)
    .catch((error) => {
      LoggerService.getInstance().error(error);
    })
    .finally(async () => await fetchMenus());
  }
  

  //Menu import Action Handlers

  //This is called whenever something in a menu sub-component changes
  const handleChangeMenu = useCallback((index: number, sections: MenuSection[], apps: MenuApp[], id?: string) => {
    let newMenus = brandMenus.slice();
    newMenus[index].sections = sections.slice();
    setBrandMenus(newMenus);
  },[brandMenus]);
  
  const handleImportFromBranch = (branch: BranchMetadata) => {
    setBranchToImportFrom(branch);
  }

  const handleImportMenu = (menu: Menu) => {
    setSourceMenu(menu);
  }

  const handleConfirmImport = async () => {
    if (branchToImportFrom && destinationMenu && sourceMenu) {     
      toggleImportModal();
      //Replace destinationMenu sections with sourceMenu sections
      let newMenu: Menu;
      if (destinationMenu.id) {
        newMenu = {
          id: destinationMenu.id,
          apps: destinationMenu.apps.slice(),
          brand: {
            id: destinationMenu.brand.id,
            name: destinationMenu.brand.name,
          },
          sections: removeIdsFromMenu(sourceMenu.sections.slice())
        }
      } else {
        newMenu = {
          sections: removeIdsFromMenu(sourceMenu.sections.slice()),
          apps: destinationMenu.apps.slice(),
          brand: {
            id: destinationMenu.brand.id,
            name: destinationMenu.brand.name,
          },
        }
      }
      const newMenus = brandMenus.filter(m => m.id !== newMenu.id || m.brand.id !== newMenu.brand.id).slice();
      newMenus.push(newMenu);
      setBrandMenus(sortMenus(newMenus));
      setMenuActionMessage({ message: 'Menu importado con éxito', class: 'success'});
    }
  }

  //Persistance of Menu
  const handleSaveMenu = async (brand: MenuBrand, sections: MenuSection[], apps: MenuApp[], id?: string) => {
    const menu: Menu = {
      id: id,
      brand: {
        id: brand.id,
        name: brand.name,
      },
      sections: sections.filter(s => s.name !== ""),
      apps: apps.map(app => ({app: app.app, active: app.active})).slice()
    }
    setLoading(true);
    if (id) {
      await updateMenu(activeBranchId, brand.id, menu)
      .then((response) => {
        setMenuActionMessage({ message: 'Su menú fue actualizado con éxito', class: 'success'});
      })
      .catch((error) => {
        LoggerService.getInstance().error(error);
        setMenuErrorMessage(`Hubo un problema al guardar el menú, porfavor revise las alertas en la configuración del menú. (${error}})`);
        openWarningModalWithClass('warning');
      })
      .finally(async () => await fetchMenus());
    } else {
      await createMenu(activeBranchId, brand.id, menu)
      .then((response) => {
        setMenuActionMessage({ message: 'Su menú fue creado con éxito', class: 'success'});
      })
      .catch((error) => {
        LoggerService.getInstance().error(error);
        setMenuErrorMessage(`Hubo un problema al guardar el menú, porfavor revise las alertas en la configuración del menú. (${error}})`);
        openWarningModalWithClass('warning');
      })
      .finally(async () => await fetchMenus());
    }
  }

  const handlePublishMenu = async (brand: MenuBrand, sections: MenuSection[], apps: MenuApp[], id?: string) => {
    const menu: Menu = {
      id: String(id),
      brand: {
        id: brand.id,
        name: brand.name,
      },
      sections: sections.filter(s => s.name !== ""),
      apps: apps.map(app => ({app: app.app, active: app.active})).slice()
    }
    setLoading(true);
    let appsWithError: string[] = [];
    await publishMenu(activeBranchId, menu.id || '')
    .then((response) => {
      const publishStatus = response.data as PublishStatus[];  
      for(const status of publishStatus) {
        //App had an error when publishing
        if (!status.status) {
          appsWithError.push(`${config.appNames[status.app] || status.app}: ${status.error}`);
        }
      }
      if (appsWithError.length === 0) {
        setMenuActionMessage({ message: 'Su menú está siendo publicado en las aplicaciones. Este proceso puede tardar unos minutos. Recuerde revisar en los portales de las aplicaciones si su menú se publicó correctamente.', class: 'success'});
      } else {
        throw new Error(appsWithError.join(', '));
      }
    })
    .catch((error) => {
      LoggerService.getInstance().error(error);
      openWarningModalWithClass('warning');
      setMenuErrorMessage(`Hubo un problema al publicar el menú. 
        ${appsWithError.length > 0 ? 
        'Las siguientes aplicaciones tuvieron problemas al publicar: ' + appsWithError.join(', ') : 
        '(' + error + ')' }`);
    })
    .finally(async () => await fetchMenus());
  }

  //New menu handlers
  const handleNewMenuClick = () => {
      setShowPotentialAvailableMenus(true);
  }

  const handlePotentialMenuSelect = (key: any, event: Object) => {
    const potentialMenuSelected = potentialMenus.find(menu => menu.brand.id.toString() === key);
    setShowPotentialAvailableMenus(false);
    //Add to brand menus
    setBrandMenus((menus) => {
      let newMenus = menus.slice();
      if (potentialMenuSelected) {
          newMenus.push(potentialMenuSelected);
      }
      return sortMenus(newMenus);
    });
    //Remove from potential menus
    setPotentialMenus((menus) => {
      let newMenus = menus.slice();
      if (potentialMenuSelected) {
          newMenus = newMenus.filter(menu => menu.brand.id.toString() !== key);
      }
      return newMenus;
    });
  }

  //Effects
  //This will trigger every time the activeBranchId changes
  useEffect(() => {
    setLoading(true);
    fetchMenus();
  },[activeBranchId, fetchMenus]);

  useEffect(() => {
    if (menuActionMessage) {
        //Clean error message after 5 seconds
        setTimeout(() => {
            setMenuActionMessage(undefined);
        }, 10000)
    }
  } ,[menuActionMessage]);

  return (
    <>
      <DarwinSectionTitle 
      title={t('Menu')}
      subtitle={t('In this section you can manage the menu for all brands') + '.'}
      />
      {   loading && 
          <div className='text-center'>
            <Spinner className="spinner-border my-2" />
          </ div>
      }
      {
        menuActionMessage &&
        <div className='d-flex justify-content-center'>
        <Card className={`bg-${menuActionMessage.class} text-white mb-3 p-0`}>
          <Card.Body className='ps-1 pe-1 pb-1 pt-1 text-center'>
              <div className='d-flex justify-content-end'>
                <label onClick={() => setMenuActionMessage(undefined)} className='me-2'>X</label>
              </div>
              <p className='mt-2'>
                {`${menuActionMessage.message}`}</p>
          </Card.Body>
        </Card>
        </div>
      }
      <Accordion activeKey={activeAccordions} id="accordion-settings" className="custom-accordion" alwaysOpen={true}>
      {
        !loading &&
        brandMenus
        //.filter(menu => (menu.id && menu.apps.some(app => app.active)) || !menu.id)
        .map( (menu: Menu, index: number) => {
          return (
            <MenuAccordionRow
                key={'menu-' + index}
                eventKey={'menu-' + index}
                item={ { 
                  menuId: menu.id,
                  brand: menu.brand, 
                  brandLogo: ((brandInfo as Brand[] || []).find(brand => brand.id === menu.brand.id)?.logoSmall || ''), 
                  apps: menu.apps.slice(),
                  sections: menu.sections.slice(),
                } }
                isActive={activeAccordions.includes('menu-' + index)}
                canImport={loggedInUser.role.includes(Role.ADMIN)}
                canDuplicate={ 
                              //Has sections to duplicate
                              menu.sections.length > 0 &&
                              //Cannot exceed the number of apps
                              brandMenus.filter(m => m.brand.id === menu.brand.id).length <= menu.apps.length}
                canDelete={menu.apps.slice().length === 0}
                handleClickOnAccordion={() => handleClickOnAccordion('menu-' + index)}
                handleImport={handleImport}
                handleDuplicate={handleDuplicate}
                handleDeleteMenu={handleDeleteMenu}

                content={
                <MenuCard 
                  index={index}
                  brand={menu.brand} 
                  apps={menu.apps.slice()} 
                  sections={menu.sections.slice()} 
                  id={menu.id} 
                  onSaveMenu={handleSaveMenu}
                  onPublishMenu={handlePublishMenu}
                  onChangeMenu={handleChangeMenu}
                  />}     
            />
          );
        })
      }
      </Accordion>
        <div className='text-center my-3'>
        { !loading && potentialMenus.length > 0 && !showPotentialAvailableMenus && 
          (
            <Button type="button" variant="primary">
            <i title='Nuevo menú' className="dripicons-plus" onClick={handleNewMenuClick}></i>
            </Button>
          )
        }
        {
          !loading && potentialMenus.length > 0 && showPotentialAvailableMenus &&
          <>
            <DropdownButton variant="primary" title={'Elija una marca'} onSelect={handlePotentialMenuSelect}>
                    { 
                      potentialMenus.map( (menu, index) => {
                        return (<Dropdown.Item key={index+1} eventKey={menu.brand.id}>{menu.brand.name || ''}</Dropdown.Item>)
                      })
                    }
            </DropdownButton>
          </>
        }
        </div>
        {/* Warning modal when saving menu  */}
        <Modal show={isWarningModalOpen} onHide={toggleWarningModal} dialogClassName={warningModalclassName}>
            <Modal.Header className={classNames('modal-colored-header', 'bg-' + warningModalclassName)} onHide={toggleWarningModal} closeButton>
            </Modal.Header>
            <Modal.Body>
            {menuErrorMessage}
            </Modal.Body>
        </Modal>
        {/* Import modal */}
        <Modal show={isImportModalOpen} onHide={toggleImportModal} dialogClassName={importModalclassName}>
            <Modal.Header className={classNames('modal-colored-header', 'bg-' + importModalclassName)} onHide={toggleImportModal} closeButton>
            </Modal.Header>
            <Modal.Body>
              <MenuImport 
                brand={destinationMenu?.brand} 
                branches={branches.filter(br => br.id !== activeBranchId)} 
                handleSelectBranch={handleImportFromBranch} 
                handleSelectMenu={handleImportMenu}
                />
            </Modal.Body>
            <Modal.Footer>
                <div className='d-flex align-items-center'>
                  <Button className='me-2' variant="primary" 
                    onClick={() => { 
                      setDestinationMenu(undefined); 
                      setBranchToImportFrom(undefined); 
                      setSourceMenu(undefined);
                      toggleImportModal(); }}>
                      Cancelar
                  </Button>
                  <Button variant="primary" onClick={handleConfirmImport}>
                      Confirmar
                  </Button>
                </div>
            </Modal.Footer>
        </Modal>  


    </>
  )
}

export default MenuDashboard;