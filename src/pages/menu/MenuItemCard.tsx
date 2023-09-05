import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { MenuItem, MenuItemCardProps } from './types'
import { useEffect, useState } from 'react';
import { MenuItemModifiers } from './MenuItemModifiers';
import config from 'config/config';
import './sortableStyle.css';

export const MenuItemCard = ({ menuItem, index, handleDeleteMenuItemOnSection, handleConfirmMenuItemOnSection, handleEditMenuItemOnSection }: MenuItemCardProps) => {

  //Local state variables
  const [localMenuItem, setLocalMenuItem] = useState<MenuItem>(menuItem);
  const [finishedEditing, setFinishedEditing] = useState<boolean>(true);
  const [evenPosition, setEvenPosition] = useState<boolean>(index % 2 === 0);

  const imageAvailable = menuItem.product.image;
  const imageSrc = config.imageUrl + menuItem.product.image;
  //Handlers
  const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0;
    setLocalMenuItem({ ...localMenuItem, price: value });
  }

  const handleFinishEditing = () => {
    setFinishedEditing(true);
    handleConfirmMenuItemOnSection(localMenuItem);
    handleEditMenuItemOnSection(false);
  }

  const handleDelete = () => {
    handleDeleteMenuItemOnSection(localMenuItem.product.id);
  }

  const handleMenuItemModifiersChange = (menuItem: MenuItem) => {
    setLocalMenuItem({ ...localMenuItem, modifierGroups: menuItem.modifierGroups });
  }

  const handleCancelEdit = () => {
    //Set menu item as it was before editing
    setLocalMenuItem(menuItem);
    setFinishedEditing(true);
    handleEditMenuItemOnSection(false);
  }

  const handleEdit = () => {
    setFinishedEditing(false);
    handleEditMenuItemOnSection(true);
  }

  useEffect(() => {
    setEvenPosition(index % 2 === 0);
  }, [index]);

  //This will update local variable whenever a change is triggered by duplicating or importing a menu
  useEffect(() => {
    setLocalMenuItem(menuItem);
  }, [menuItem])

  return (
    <>
    {
      finishedEditing &&
          <Container>
          <Row className={`${evenPosition ? 'bg-light': 'bg-white'}`}>
            <Col className='pe-0' xs={2}>
              <div className='d-flex justify-content-start'>
              <i style={{fontSize: '20px'}} className=" handle pe-2 pt-1 mdi mdi-drag-vertical"></i>
              { imageAvailable ?
              (<img
                  src={imageSrc}
                  height='50px'
                  width='50px'
                  style={{ border: '1px solid black', float: 'left' }}
                  className="img-fluid"
                  alt="Product-img"
              />) :
              <img
                src=""
                height='50px'
                width='50px'
                alt="Producto sin imágen"
                className="img-fluid img-thumbnail p-2"
                style={{ border: '1px solid black', float: 'left' }}
              />
              }
              </div>
            </Col>
            <Col xs={4}>
              <h5>{`${localMenuItem.product.name || 'Producto sin nombre en menú'}`}</h5>
            </Col>
            <Col  xs={3}>
              <h5>{`$ ${localMenuItem.price}`}</h5>
            </Col>
            <Col xs={3}>
              <div style={{float: 'right'}}>
                <Button className='me-3 mt-1' type="button" variant="outline-danger" onClick={handleDelete}>
                  <i className="mdi mdi-trash-can"></i>
                </Button>
                <Button className='mt-1' type="button" variant="outline-primary" onClick={handleEdit}>
                  <i className="mdi mdi-pencil"></i>
                </Button>
              </div>
            </Col>
          </Row>
          </Container>      
    }
    { !finishedEditing &&
    <Card className='w-100 bg-light my-1'>
        <Card.Body className='ps-0 pe-0 pt-2 pb-2'>
          <Container className='ps-0 pe-0' fluid>   
            <Row>
            <Col xs={3}>
            { imageAvailable ?
              (<img
                  src={imageSrc}
                  height='150px'
                  width='150px'
                  style={{ border: '1px solid black', float: 'left' }}
                  alt="Product-img"
              />) :
              <img
                src=""
                height='150px'
                width='150px'
                alt="Producto sin imágen"
                className="img-fluid img-thumbnail p-2"
                style={{ border: '1px solid black', float: 'left' }}
              />
            }
            </Col>
            <Col xs={5}>
              <div>
                <h4>{`${localMenuItem.product.name || 'Producto sin nombre en menú'}`}</h4>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <label>Ingrese el Precio: $</label>
                    <input  type="number" min="0"
                            style={{ width: '100px', textAlign: 'right' }}
                            className="form-control mx-1"
                            value={Number(localMenuItem.price).toString()} //This will remove leading zeros
                            onChange={(e) => { handleOnChangeInput(e) }}
                            disabled={finishedEditing}
                    />
                </div>
                { localMenuItem.product.description && 
                  <p className='text-muted my-1'>̣<b>{`Descripción: `}</b>{localMenuItem.product.description}</p>}
              </div>
            </Col>
            <Col xs={4}>
              <MenuItemModifiers menuItem={localMenuItem} disabled={finishedEditing} onMenuItemModifiersChange={handleMenuItemModifiersChange} />
            </Col>    
            </Row>
            <Row>
            {
              !finishedEditing &&
              <Col>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', float: 'right'}}>
                <Button variant='primary' className='mx-1' onClick={handleFinishEditing}>Confirmar</Button>
                <Button variant='danger' className='mx-1' onClick={handleCancelEdit}>Cancelar</Button>
              </div>
              </Col>
            }
            </Row>
          </Container>
        </Card.Body>
    </Card>
    }
    </>
  )
}
