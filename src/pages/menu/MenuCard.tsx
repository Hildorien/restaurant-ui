import { useCallback, useEffect, useState } from 'react';
import { MenuActions } from './MenuActions';
import { MenuSections } from './MenuSections';
import { MenuCardProps, MenuApp, MenuSection } from './types';
import { Card } from 'react-bootstrap';

const MenuCard = ({ brand, apps, id, sections, index, onSaveMenu, onPublishMenu, onChangeMenu  }: MenuCardProps) => {

    //Local Variables
    const [localSections, setLocalSections] = useState<MenuSection[]>(sections);
    
    const handleChangeOnMenu = useCallback((sections: MenuSection[]) => { 
        setLocalSections(sections.slice());
        onChangeMenu(index, sections, apps, id);
    }, [onChangeMenu, apps, id, index]);

    const handleSaveMenu = (sections: MenuSection[], apps: MenuApp[]) => {
        onSaveMenu(brand, sections, apps, id);
    }

    const handlePublishMenu = (sections: MenuSection[], apps: MenuApp[]) => {
        onPublishMenu(brand, sections, apps, id);
    }

    useEffect(() => {
        setLocalSections(sections);
    }, [sections]);
    
    return (
      <>
      <Card className='mb-0 pb-0'>
          <Card.Body className='pb-0 pt-1 border-0 ps-0 pe-0'>
              <MenuActions menuId={id} brand={brand} sections={localSections} apps={apps} onSaveMenu={handleSaveMenu} onPublishMenu={handlePublishMenu}  />
              <MenuSections brand={brand} apps={apps} sections={localSections} handleChangeOnMenu={handleChangeOnMenu} />
          </Card.Body>
      </Card>
      </>
    )
}

export default MenuCard;