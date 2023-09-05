import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import { getMenuItems } from 'helpers';
import AppMenu from './Menu/';

//Original assets
import logoSm from 'assets/images/logo_sm.png';
import logoDark from 'assets/images/logo-dark.png';
import logoDarkSm from 'assets/images/logo_sm_dark.png';
import logo from 'assets/images/logo.png';


/*import logo from 'assets/images/Darwin/Logos_darwin-08.png';
import logoDark from 'assets/images/Darwin/Logos_darwin-08.png';
import logoSm from 'assets/images/Darwin/2-logo_colapsado-02.png';
import logoDarkSm from 'assets/images/Darwin/2-logo_colapsado-02.png';*/

/*import helpBoxImage from 'assets/images/help-icon.svg';
import profileImg from 'assets/images/users/avatar-1.jpg';
import classNames from 'classnames';
import { PromoBanner } from './PromoBanner';*/

type SideBarContentProps = {
    hideUserProfile: boolean;
};

const SideBarContent = ({ hideUserProfile }: SideBarContentProps) => {

    return (
        <>
            {!hideUserProfile && (
                <div className="leftbar-user">
                    <Link to="/">
                        <img src={logo} alt="" height="42" className="rounded-circle shadow-sm" />
                        <span className="leftbar-user-name">Dominic Keller</span>
                    </Link>
                </div>
            )}
            <AppMenu menuItems={getMenuItems()} />
            <div className="clearfix" />
        </>
    );
};

type LeftSidebarProps = {
    hideLogo?: boolean;
    hideUserProfile: boolean;
    isLight: boolean;
    isCondensed: boolean;
};

const LeftSidebar = ({ isCondensed, isLight, hideLogo, hideUserProfile }: LeftSidebarProps) => {
    const menuNodeRef = useRef<HTMLDivElement>(null);

    /**
     * Handle the click anywhere in doc
     */
    const handleOtherClick = (e: MouseEvent) => {
        if (menuNodeRef && menuNodeRef.current && menuNodeRef.current.contains(e.target as Node)) return;
        // else hide the menubar
        if (document.body) {
            document.body.classList.remove('sidebar-enable');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOtherClick, false);

        return () => {
            document.removeEventListener('mousedown', handleOtherClick, false);
        };
    }, []);

    return (
        <div className="leftside-menu" ref={menuNodeRef}>
            {!hideLogo && (
                <>
                    <Link to="/" className="logo text-center logo-light">
                        <span className="logo-lg">
                            {/*<img src={logo} alt="logo" height="24"></img>*/}
                            <img src={isLight ? logoDark : logo} alt="logo" height="32" />
                        </span>
                        <span className="logo-sm">
                            {/*<img src={logo} alt="logo" height="16"></img>*/}
                            <img src={isLight ? logoSm : logoDarkSm} alt="logo" height="16" />
                        </span>
                    </Link>

                    <Link to="/" className="logo text-center logo-dark">
                        <span className="logo-lg">
                            <img src={isLight ? logoDark : logo} alt="logo" height="32" />
                            {/*<img src={logo} alt="logo" height="24"></img>*/}
                        </span>
                        <span className="logo-sm">
                            <img src={isLight ? logoSm : logoDarkSm} alt="logo" height="16" />
                            {/*<img src={logo} alt="logo" height="24"></img>*/}
                        </span>
                    </Link>
                </>
            )}

            {!isCondensed && (
                <SimpleBar style={{ maxHeight: '100%' }} timeout={500} scrollbarMaxSize={320}>
                    <SideBarContent hideUserProfile={hideUserProfile} />
                </SimpleBar>
            )}
            {isCondensed && <SideBarContent hideUserProfile={hideUserProfile} />}
        </div>
    );
};

export default LeftSidebar;
