import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { resetAuth, passwordChange } from 'redux/actions';
import { useRedux } from 'hooks';
import { ChangePasswordData } from '../ChangePassword';
import { Location, useLocation } from 'react-router-dom';


type LocationState = {
    from?: Location;
};

export default function useChangePassword() {
    const { dispatch, appSelector } = useRedux();
    const { t } = useTranslation();

    const location: Location = useLocation();
    let redirectUrl: string = '/';

    if (location.state) {
        const { from } = location.state as LocationState;
        redirectUrl = from ? from.pathname : '/';
    }

    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    const { loading, passwordChangeSuccess, error } = appSelector((state) => ({
        loading: state.Auth.loading,
        user: state.Auth.user,
        error: state.Auth.error,
        passwordChangeSuccess: state.Auth.passwordChangeSuccess,
    }));

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            oldPassword: yup.string().required(t('Please enter current Password')),
            newPassword: yup.string()
            .notOneOf([yup.ref('oldPassword'), null], t("Current password must be different from new password"))
            .required(t('Please enter new Password'))
            .min(8, t('Must be 8 characters or more'))
            .matches(/[a-z]+/, t('At least one lowercase character'))
            .matches(/[A-Z]+/, t('At least one uppercase character')),
            confirmNewPassword: yup.string()
            .oneOf([yup.ref('newPassword'), null], t("Passwords don't match"))
            .required(t('Please enter new Password'))
            
        })
    );

    /*
     * handle form submission
     */
    const onSubmit = (formData: ChangePasswordData) => {
        dispatch(passwordChange(formData['email'].trim(), formData['oldPassword'].trim(), formData['newPassword'].trim()));
    };

    return {
        loading,
        passwordChangeSuccess,
        error,
        schemaResolver,
        onSubmit,
        redirectUrl,
    };
}
