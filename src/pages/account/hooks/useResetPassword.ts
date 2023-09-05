import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { resetAuth, forgotPasswordConfirm } from 'redux/actions';
import { useRedux } from 'hooks';
import { ResetPasswordData } from '../ResetPassword';
import { Location, useLocation } from 'react-router-dom';

type LocationState = {
    from?: Location;
};

export default function useResetPassword() {
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

    const { loading, resetPasswordConfirmSuccess, error } = appSelector((state) => ({
        loading: state.Auth.loading,
        user: state.Auth.user,
        error: state.Auth.error,
        resetPasswordConfirmSuccess: state.Auth.resetPasswordConfirmSuccess,
    }));

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            email: yup.string().required(t('Please enter email')),
            code: yup.string().required(t('Please enter verification code')),
            newPassword: yup.string()
            .required(t('Please enter Password'))
            .min(8, t('Must be 8 characters or more'))
            .matches(/[a-z]+/, t('At least one lowercase character'))
            .matches(/[A-Z]+/, t('At least one uppercase character'))
        })
    );

    /*
     * handle form submission
     */
    const onSubmit = (formData: ResetPasswordData) => {
        dispatch(forgotPasswordConfirm(formData['email'].trim(), formData['code'].trim(), formData['newPassword'].trim()));
    };

    return {
        loading,
        resetPasswordConfirmSuccess,
        error,
        schemaResolver,
        onSubmit,
        redirectUrl,
    };
}
