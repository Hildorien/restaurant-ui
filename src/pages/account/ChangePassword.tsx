import { Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { VerticalForm, FormInput, Spinner } from 'components';
import AccountLayout from './AccountLayout';
import useChangePassword from './hooks/useChangePassword';
import { useUser } from 'hooks';
import useAnalyticsEventTracker from 'hooks/useAnalyticsEventTracker';
import { useEffect } from 'react';

export type ChangePasswordData = {
    email: string;
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};

const BottomLink = () => {
    const { t } = useTranslation();

    return (
        <Row className="mt-3">
            <Col className="text-center">
                <p className="text-muted">
                    {t('Back to')}{' '}
                    <Link to={'/account/login'} className="text-muted ms-1">
                        <b>{t('Log In')}</b>
                    </Link>
                </p>
            </Col>
        </Row>
    );
};

const ChangePassword = () => {
    const { t } = useTranslation();
    const [loggedInUser] = useUser();
    const { loading, passwordChangeSuccess, error, schemaResolver, onSubmit, redirectUrl } = useChangePassword();

    const eventTracker = useAnalyticsEventTracker({ category: "Account"});

    useEffect(() => {
        if (passwordChangeSuccess) {
            eventTracker('changed password');
        }
    }, [passwordChangeSuccess, eventTracker]);
    
    return (
        <>
                 
        { passwordChangeSuccess ? <Navigate to={redirectUrl} ></Navigate> : null}
        
        <AccountLayout bottomLinks={<BottomLink />}>
            <div className="text-center m-auto">
                <h4 className="text-dark-50 text-center mt-0 font-weight-bold">{t('Change Password')}</h4>
            </div>

            {/*resetPasswordSuccess && <Alert variant="success">{resetPasswordSuccess.data.message}</Alert>*/}

            {error && !passwordChangeSuccess && (
                <Alert variant="danger" className="my-2">
                    {t(error)}
                </Alert>
            )}

            <VerticalForm<ChangePasswordData> onSubmit={onSubmit} resolver={schemaResolver}>
                    <FormInput
                        label={t('Email address')}
                        type="text"
                        name="email"
                        placeholder={t('Enter your email')}
                        containerClass={'mb-3'}
                        value={loggedInUser?.email}
                        readOnly={loggedInUser?.email !== undefined}
                    />
                    <FormInput
                        label={t('Current Password')}
                        type="password"
                        name="oldPassword"
                        placeholder={t('Enter your current password')}
                        containerClass={'mb-3'}
                    />
                    <FormInput
                        label={t('New Password')}
                        type="password"
                        name="newPassword"
                        placeholder={t('Enter your new password')}
                        containerClass={'mb-3'}
                    />
                    <FormInput
                        label={t('Confirm New Password')}
                        type="password"
                        name="confirmNewPassword"
                        placeholder={t('Confirm your new password')}
                        containerClass={'mb-3'}
                    />

                    <div className="mb-3 mb-0 text-center">
                        {   !loading &&
                            <Button variant="primary" type="submit" disabled={loading}>
                            {t('Confirm')}
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

export default ChangePassword;
