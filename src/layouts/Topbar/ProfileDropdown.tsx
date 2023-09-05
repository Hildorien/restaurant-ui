import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import classNames from 'classnames';
import { useToggle } from 'hooks';
import { ProfileOption } from '../types';
import { useTranslation } from 'react-i18next';
import StoreVerificationCodes from 'components/DarwinComponents/StoreVerificationCode';

type ProfileDropdownProps = {
    menuItems: Array<ProfileOption>;
    userImage: string;
    username: string;
    userTitle?: string;
};

const ProfileDropdown = ({ userTitle, username, menuItems, userImage }: ProfileDropdownProps) => {
    const [isOpen, toggleDropdown] = useToggle();
    const { t } = useTranslation();


    return (
        <Dropdown show={isOpen} onToggle={toggleDropdown}>
            <Dropdown.Toggle
                variant="link"
                id="dropdown-profile"
                as={Link}
                to="#"
                onClick={toggleDropdown}
                className="dropdown-toggle arrow-none mx-1"
            >
                {/*
                {userImage !== "" && <span className="account-user-avatar">
                    <img src={userImage} className="rounded-circle" alt="user" />
                </span>}
                <span>
                    <span className="account-user-name">{username}</span>
                    <span className="account-position">{userTitle}</span>
                </span>*/}
                    <span>
                        <i className="dripicons-gear noti-icon text-light"></i>
                    </span>
            </Dropdown.Toggle>
            <Dropdown.Menu align={'end'} className="dropdown-menu-animated topbar-dropdown-menu profile-dropdown">
                <div onClick={toggleDropdown}>
                    <div className="dropdown-header noti-title">
                        <h6 className="text-overflow m-0">{t("Welcome")} {username} !</h6>
                    </div>
                    {menuItems.map((item, i) => {
                        return (
                            <Link to={item.redirectTo} className="dropdown-item notify-item" key={i + '-profile-menu'}>
                                <i className={classNames(item.icon, 'me-1')}></i>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                    <StoreVerificationCodes/>
                    {/** Logout as last option always */}
                    <Link to={'/account/logout'} className="dropdown-item notify-item" key={'logout-profile-menu'}>
                                <i className={classNames('mdi mdi-logout', 'me-1')}></i>
                                <span>{t('Logout')}</span>
                    </Link>
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ProfileDropdown;
