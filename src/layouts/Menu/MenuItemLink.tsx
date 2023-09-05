import classNames from 'classnames';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { SubMenus } from './types';

const MenuItemLink = ({ item, className }: SubMenus) => {
    return (
        <Link
            to={{ pathname: item.url }}
            target={item.target}
            className={classNames('side-nav-link-ref', 'side-sub-nav-link', className)}
            data-menu-key={item.key}
        >
            {item.icon && <i className={item.icon}></i>}
            {item.badge && (
                
                <OverlayTrigger
                placement='right'
                overlay={
                item.badge.toolTipText ? (
                <Tooltip id={"tooltip-" + item.label}>{item.badge?.toolTipText || ""}</Tooltip>) : <span></span>}>
                    <span
                    className={classNames('badge', 'bg-' + item.badge.variant, 'rounded', 'font-10', 'float-end', {
                        'text-dark': item.badge.variant === 'light',
                        'text-light': item.badge.variant === 'dark' || item.badge.variant === 'secondary',
                    })}
                >
                    {item.badge.text}
                </span>
                </OverlayTrigger>
            )}
            <span> {item.label} </span>
        </Link>
    );
};

export default MenuItemLink;
