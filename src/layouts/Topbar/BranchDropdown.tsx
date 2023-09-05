import { BranchContext, BranchContextType } from 'context/BranchProvider';
import { t } from 'i18next';
import { useContext, useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { BranchMetadata } from 'redux/branch/types';
import SimpleBar from 'simplebar-react';

const BranchDropdown = () => {

    const { activeBranchId, setActiveBranchId, branches } = useContext(BranchContext) as BranchContextType;
    const [activeBranchMetadata, setActiveBranchMetadata] = useState<BranchMetadata | undefined>(
      branches
      .find(branch => branch.id === activeBranchId) || branches[0]);

    const handleSelect = (key: any, event: Object) => {
        branches.forEach(branch => {
          if (branch.id.toString() === key) {
            setActiveBranchId(branch.id);
            setActiveBranchMetadata(branch);
          }
        });
    }

    useEffect(() => {
      if (branches.length > 0) {
        const activeBranch = branches.find(branch => branch.id === activeBranchId) || branches[0];
        setActiveBranchMetadata(activeBranch);
      }
    }, [activeBranchId, branches])
    
    return(
            <DropdownButton
            variant="primary" 
            title={ (activeBranchMetadata === undefined) ? t('Loading branches...') : String('Sucursal: ' + t(activeBranchMetadata.name)).slice(0,50)} 
            onSelect={handleSelect}>
              <SimpleBar autoHide={false} style={{maxHeight: '280px', 'width': '280px'}}>
              {branches.map( (branch, index) => {
                 return (<Dropdown.Item key={index}
                  href="#" eventKey={ branch.id } active={branch.name===activeBranchMetadata?.name} >{t(branch.name)}</Dropdown.Item>)
                })}
              </SimpleBar>
            </DropdownButton>
    )
}

export default BranchDropdown;