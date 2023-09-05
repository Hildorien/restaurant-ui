import { useEffect, useState } from 'react';
import { Accordion, Button, Card, Row } from 'react-bootstrap'
import { ReactSortable } from 'react-sortablejs';
import { MenuSectionsProps, MenuSection, SortableMenuSection } from './types';
import { MenuSectionCard } from './MenuSectionCard';
import { MenuSectionAccordionRow } from './MenuSectionAccordionRow';
import './sortableStyle.css';

export const MenuSections = ({ brand, sections, handleChangeOnMenu }: MenuSectionsProps) => {

    const [sortableSections, setSortableSections] = useState<SortableMenuSection[]>(
        sections.map((section, index) => ({ id: index, element: section})));
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

    const handleNewSection = () => {
        const currSections = sortableSections.slice();
        const newSection = { 
            id: currSections.length + 1,
            element: {
                name: '', 
                active: true, 
                position: (currSections.length + 1), 
                items: []
            } 
        }
        currSections.push(newSection);
        setSortableSections(currSections);
        handleChangeOnMenu(currSections.map(s => s.element).slice());
    }

    
    const handleEditOnAccordion = (id: string, name: string) => {
        const sectionToEdit = sortableSections.find(sortableSection => String(sortableSection.id) === id);
        if (sectionToEdit && sectionToEdit.element.name !== name) {
            const sectionEdited: SortableMenuSection = {  id: sectionToEdit.id, element: { ...sectionToEdit.element, name } };
            const modifiedSections = sortableSections.map((section) => {
                if (section.id === sectionEdited.id) {
                    return sectionEdited;
                } else {
                    return section;
                }
            });
            setSortableSections(modifiedSections.slice());
            handleClickOnAccordion(String(sectionToEdit.id));
            handleChangeOnMenu(modifiedSections.map(s => s.element).slice());
        }        
    }

    const handleDeleteOnAccordion = (id: string) => {
        const newSortableSections = sortableSections.filter(sortableSection => String(sortableSection.id) !== id);
        setSortableSections(newSortableSections.slice());
        handleChangeOnMenu(newSortableSections.map(s => s.element).slice());
    }
        
    const handleModificationOnSection = (section: MenuSection) => {
        const modifiedSections = sortableSections.map((sec, index) => {
            if (sec.element.name === section.name) {
                return {
                    id: sec.id,
                    element: { 
                        id: section.id, 
                        name: section.name, 
                        position: index, 
                        active: section.active, 
                        items:  section.items.map((item, index) => {
                            return { ...item, position: index }
                        }).slice()
                    }
                }
            } else {
                return sec;
            }
        });
        setSortableSections(modifiedSections.slice());
        handleChangeOnMenu(modifiedSections.map(s => s.element).slice());
    }

    const handleSortSections = () => {
        const modifiedSections = sortableSections.map((section, index) => {
            return {
                id: section.id,
                element: {
                    ...section.element,
                    position: index
                }
            }
        });
        setSortableSections(modifiedSections.slice());
        handleChangeOnMenu(modifiedSections.map(s => s.element).slice());
    }

    useEffect(() => {
        setSortableSections(sections.map((section, index) => ({ id: index, element: section})));
    }, [sections]);


    return (
      <Card>
          <Card.Body className='border-0 pb-0 pt-1'>
              <Accordion activeKey={activeAccordions} id="accordion-settings" className="custom-accordion" alwaysOpen={true}>
                <ReactSortable handle={'.handle'} className="col" list={sortableSections} setList={setSortableSections} onSort={handleSortSections}>
                                    {(sortableSections || []).map((sortableSection: SortableMenuSection, index: number) => {
                                        return (
                                            <Row key={`${brand.name}-${sortableSection.id}-${index}`} md={4}>
                                                <MenuSectionAccordionRow
                                                    eventKey={`${sortableSection.id}`}
                                                    item={ { id: String(sortableSection.id), name: sortableSection.element.name } }
                                                    isActive={activeAccordions.includes(`${sortableSection.id}`)}
                                                    isEmpty={sortableSection.element.items.length === 0}
                                                    itemsWithoutPrice={sortableSection.element.items.filter(i => i.price === 0 || String(i.price) === "0.00").length}
                                                    otherSectionNames={sortableSections.filter(sec => sec.id !== sortableSection.id).map(sec => sec.element.name)}
                                                    handleClickOnAccordion={handleClickOnAccordion}
                                                    handleDeleteOnAccordion={handleDeleteOnAccordion}
                                                    handleEditOnAccordion={handleEditOnAccordion}
                                                    content={ 
                                                    <MenuSectionCard 
                                                        section={sortableSection.element} 
                                                        brand={brand}
                                                        onDeleteMenuItemInSection={handleModificationOnSection}
                                                        onNewMenuItemInSection={handleModificationOnSection}
                                                        onSortItemsInSection={handleModificationOnSection}
                                                    />}     
                                                    />
                                            </Row>
                                        );
                                    })}
                </ReactSortable>
              </Accordion>
            <div className="d-flex align-items-center justify-content-center" >
              <Button variant="primary" className='w-75' onClick={handleNewSection}>Nueva Sección</Button> 
            </div>
          </Card.Body>
      </Card>
    )
}
