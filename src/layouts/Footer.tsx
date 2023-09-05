import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
//import { Link } from 'react-router-dom';
import WhatsAppWidget from "react-whatsapp-chat-widget";
import "react-whatsapp-chat-widget/index.css";
import config from 'config/config';
import { useUser } from 'hooks';
import { User } from 'config/types';
import { GlobalVariablesContext, GlobalVariablesContextType } from 'context/GlobalVariablesProvider';
import { useContext } from 'react';

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();
    const [loggedInUser] = useUser();
	const { isDarwinElectron } = useContext(GlobalVariablesContext) as GlobalVariablesContextType;
	const footerLabel: string = "Restaurant UI " + (isDarwinElectron ? "Desktop" : "Web");  
    const username = (loggedInUser as User)?.name || '';
    
	return (
        <footer className="footer">
            <div className="container-fluid">
                <Row>
                    <Col md={6}>{currentYear + " " + footerLabel} </Col>

                    <Col md={6}>
                        <div className="text-md-end footer-links d-none d-md-block">
                            {/*<Link to="#">About</Link>
                            <Link to="#">Support</Link>
                            <Link to="#">Contact Us</Link>*/}
                            <WhatsAppWidget
			                    phoneNo={config.whatsappNumber}
			                    position="right"
			                    widgetWidth="260px"
			                    widgetWidthMobile="260px"
			                    autoOpen={false}
			                    autoOpenTimer={2000}
			                    messageBox={false}
			                    //messageBoxTxt=
			                    iconSize="40"
			                    iconColor="white"
			                    iconBgColor="#0acf97"
			                    //headerIcon={whatsappLogo}
			                    //headerIconColor="pink"
			                    headerTxtColor="white"
			                    headerBgColor="#0acf97"
			                    headerTitle={t("Support")}
			                    headerCaption="Online"
			                    bodyBgColor="#e4e6e8"
			                    chatPersonName={t("Support")}
			                    chatMessage={<>Hola {username}. ¿Cómo puedo ayudarte?</>}
			                    footerBgColor="#e4e6e8"
			                    btnBgColor="#0acf97"
			                    btnTxtColor="white"
			                    btnTxt={t("Start chat")}
		                    />
                        </div>
                    </Col>
                </Row>
            </div>
        </footer>
    );
};

export default Footer;
