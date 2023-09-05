import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { resetAuth, signupConfirm } from 'redux/actions';
import { useRedux } from 'hooks';
import { SignupConfirmData } from '../SignupConfirm';

export default function useSignupConfirm() {
    const { dispatch, appSelector } = useRedux();
    const { t } = useTranslation();
    
    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    const { loading, signupConfirmSuccess, error } = appSelector((state) => ({
        loading: state.Auth.loading,
        user: state.Auth.user,
        error: state.Auth.error,
        signupConfirmSuccess: state.Auth.signupConfirmSuccess,
    }));

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            code: yup.string().required(t('Please enter verification code')),
            email: yup.string().required(t('Please enter email'))
        })
    );

    /*
     * handle form submission
     */
    const onSubmit = (formData: SignupConfirmData) => {
        dispatch(signupConfirm(formData['email'], formData['code']));
    };

    return {
        loading,
        signupConfirmSuccess,
        error,
        schemaResolver,
        onSubmit,
    };
}
