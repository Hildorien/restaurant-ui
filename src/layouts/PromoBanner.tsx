import React from 'react'
import classNames from 'classnames';
import { Link } from 'react-router-dom'
import helpBoxImage from 'assets/images/help-icon.svg';


type PromoBannerContentProps = {
    hideUserProfile: boolean;
    title: string;
    content: string;
    buttonText: string;
};

export function PromoBanner(props: PromoBannerContentProps) {
  return (
    <div
    className={classNames('help-box', 'text-center', {
        'text-white': props.hideUserProfile,
    })}
>
    <Link to="/" className="float-end close-btn text-white">
        <i className="mdi mdi-close" />
    </Link>

    <img src={helpBoxImage} height="90" alt="Helper Icon" />
    <h5 className="mt-3">{props.title}</h5>
    <p className="mb-3">{props.content}</p>
    <button
        className={classNames(
            'btn',
            'btn-sm',
            props.hideUserProfile? 'btn-outline-light' : 'btn-outline-primary'
        )}
    >
        {props.buttonText}
    </button>
</div>
  )
}
