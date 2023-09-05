import { Navigate, Link, useLocation } from 'react-router-dom';
import { Button, Alert, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { VerticalForm, FormInput, Spinner } from 'components';
import AccountLayout from './AccountLayout';
import mailSent from 'assets/images/mail_sent.svg';
import useResetPassword from './hooks/useResetPassword';

export type ResetPasswordData = {
    email: string;
    code: string;
    newPassword: string;
};

type LocationState = {
    email: string;
};

const BottomLink = () => {
    const { t } = useTranslation();

    return (
        <Row className="mt-3">
            <Col className="text-center">
                <p className="text-muted">
                    {t('Already have account?')}{' '}
                    <Link to={'/account/login'} className="text-muted ms-1">
                        <b>{t('Log In')}</b>
                    </Link>
                </p>
            </Col>
        </Row>
    );
};

const ResetPassword = () => {
    const { t } = useTranslation();
    const { state } = useLocation();
    const { loading, resetPasswordConfirmSuccess, error, schemaResolver, onSubmit, redirectUrl } = useResetPassword();
    
    const data = state as LocationState;

    return (
        <>
            { (resetPasswordConfirmSuccess ) ? <Navigate to={redirectUrl}></Navigate> : null}

            <AccountLayout bottomLinks={<BottomLink />}>
                <div className="text-center w-75 m-auto">
                <img src={mailSent} alt="mail sent" height="64" />
                <h4 className="text-dark-50 text-center mt-4 fw-bold">{t('Please check your email')}</h4>
                <p className="text-muted mb-4">
                    {t('A email has been send to') + ' ' + (data?.email ?? '') + '. ' +
                    t('Follow the instructions to reset your password') + '.'}
                </p>
                </div>

                {error && (
                    <Alert variant="danger" className="my-2">
                        {t(error)}
                    </Alert>
                )}

                <VerticalForm<ResetPasswordData> onSubmit={onSubmit} resolver={schemaResolver} defaultValues={{}}>
                    <FormInput
                        label={t('Email address')}
                        type="email"
                        name="email"
                        value={data?.email}
                        containerClass={'mb-3'}
                        readOnly={data?.email !== undefined}
                    />
                    <FormInput
                        label={t('Verification Code')}
                        type="text"
                        name="code"
                        placeholder={t('Enter your verification code')}
                        containerClass={'mb-3'}
                    />
                    <FormInput
                        label={t('New Password')}
                        type="password"
                        name="newPassword"
                        placeholder={t('Enter your new password')}
                        containerClass={'mb-3'}
                    />
                    <div className="mb-3 mb-0 text-center">
                        {   !loading &&
                            <Button variant="primary" type="submit" disabled={loading}>
                            {t('Reset Password')}
                            </Button>
                        }
                        {
                            loading &&
                            <Spinner className="m-2" color='dark' />
                        }
                    </div>
                </VerticalForm>
            </AccountLayout>
        </>
    );
};

export default ResetPassword;
