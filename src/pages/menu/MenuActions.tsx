import { Badge, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { MenuActionsProps, MenuApp, MenuValidationTypes } from "./types";
import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import { getLogo } from "pages/kitchen/utils";
import config from "config/config";
import i18n from "i18n";

export const MenuActions = ({ menuId, brand, sections, apps, onSaveMenu, onPublishMenu }: MenuActionsProps) => {

    const [menuApps, setMenuApps] = useState<MenuApp[]>(apps);

    const hasItemsWithoutPrice = sections.some((section) => {
      return section.items.some((item) => item.price === 0 || String(item.price) === "0.00")
    });
    const hasItemsWithoutImage = sections.some((section) => {
      return section.items.some((item) => !item.product.image)
    }); 
    const hasEmptySections = sections.some((section) => {
      return section.items.length === 0
    });
    const isEmptyMenu = sections.length === 0;
    const allAppsInactive = apps.every(app => !app.active);
    const parseMenuValidation = useCallback((hasItemsWithoutPrice: boolean, 
      hasItemsWithoutImage: boolean, 
      hasEmptySections: boolean,
      isEmptyMenu: boolean,
      allAppsInactive: boolean) => {
      let menuValidations: MenuValidationTypes[] = [];
      if (hasItemsWithoutPrice) {
          menuValidations.push(MenuValidationTypes.ITEMS_WITHOUT_PRICE);
      }
      if (hasItemsWithoutImage) {
          menuValidations.push(MenuValidationTypes.ITEMS_WITHOUT_IMAGE);
      }
      if (hasEmptySections) {
          menuValidations.push(MenuValidationTypes.EMPTY_SECTIONS);
      }
      if (isEmptyMenu) {
          menuValidations.push(MenuValidationTypes.EMPTY_MENU);
      }
      if (allAppsInactive) {
        menuValidations.push(MenuValidationTypes.APPS_INACTIVE);
      }
      return menuValidations;
    }, []);

    const menuValidations = parseMenuValidation(hasItemsWithoutPrice, hasItemsWithoutImage, hasEmptySections, isEmptyMenu, allAppsInactive);

    const options: Intl.DateTimeFormatOptions = { 
      year: '2-digit', 
      month: '2-digit', 
      day: '2-digit', 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: false
    };

    //Effect for fetching metadata of apps
    useEffect(() => {
      let appsWithLogos = [];
      for (const app of apps) {
        app.logo = getLogo(app.app);
        app.name = config.appNames[app.app];
        appsWithLogos.push(app);
      }
      setMenuApps(appsWithLogos);
    }, [apps]);

    return (
      <Card className="mx-3 pt-0 pb-0 mb-0 mt-0">
        <Card.Body className="border-0 bg-light m-0 pb-2 pt-0">
          <Row className="mt-2">
            <h4 className="text-decoration-underline">Elija las aplicaciones en las que desea publicar:</h4>
          </Row>
          <Container fluid>
            <Row className="mt-2">
            {
              menuApps.map( (menuApp, index) => {
                
                let publishedAt: string = '--';
                if (menuApp.publishedAt) {
                  publishedAt = new Date(menuApp.publishedAt).toLocaleDateString(i18n.language, options);
                } 
                return(
                  <Col key={'menuApp-' + menuApp.app + '-' + index} className="text-center">
                    <Form.Check
                      style={{fontSize: '20px'}}
                      onChange={(e) => {
                        const newMenuApps = menuApps.map( (app) => {
                          if (app.app === menuApp.app) {
                            app.active = e.target.checked;
                          }
                          return app;                            
                        }).slice();
                        setMenuApps(newMenuApps);
                        }
                      }
                      checked={menuApp.active} />
                      <Form.Text className="pe-2">
                      <img 
                            src={menuApp.logo}
                            title={menuApp.name}
                            className="mx-1 my-1"
                            alt="AppLogo" style={{borderRadius: '50%'}} 
                            height="32" width="32" />
                      <label>{menuApp.name}</label>
                      </Form.Text>
                      <br></br>
                      <Badge className={classNames(menuApp.published ? 'bg-success' : 'bg-warning')}> 
                        {menuApp.published ? 'Aprobado' : 'Sin publicar'}
                      </Badge>
                      <br></br>
                      <label>Última publicación: {`${publishedAt}`}</label>
                  </Col>
                )
                })
              }
              </Row>
            </Container>
          <hr></hr>
          <div className='d-flex justify-content-center mt-1'>
            <Container fluid>
              <Row>
                <Col xs={9} className="d-flex justify-content-start">
                  <h5 className="text-decoration-underline">Configuración del menú:</h5>
                  {
                    menuValidations.length === 0 ?
                    (
                      <Badge className={classNames('bg-success', 'mx-2', 'my-2')}>{'OK'}</Badge>
                    ) : (
                      <div className="d-flex flex wrap">
                      {menuValidations.map( (menuValidation) => {
                        return(
                          <Badge key={`${brand.name} menuValidation-${menuValidation}`} 
                            className={classNames('bg-danger', 'mx-2', 'my-2')}>{menuValidation}</Badge>
                        )                      
                      })}
                      </div>
                    )
                  }                
                </Col>
                <Col xs={3} className='d-flex justify-content-end'>
                  <Button variant="primary" disabled={ !menuId && menuValidations.length > 0} className={`mx-2`} onClick={() => { onPublishMenu(sections, menuApps)}}>Publicar</Button>
                  <Button variant="primary" className='mx-2' onClick={() => { onSaveMenu(sections, menuApps)} }>Guardar</Button>
                </Col>
              </Row>
            </Container>
          </div>
        </Card.Body>
      </Card>
    )
}
