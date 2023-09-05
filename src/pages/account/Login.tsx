import { Button, Alert, /*Row, Col*/ } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { VerticalForm, FormInput, Spinner } from 'components';
import AccountLayout from './AccountLayout';
import { useLogin } from './hooks';
import useAnalyticsEventTracker from 'hooks/useAnalyticsEventTracker';
import useGASetUserId from 'hooks/useGASetUserId';
import { useUser } from 'hooks';

export type UserData = {
    username: string;
    password: string;
};

/*const BottomLink = () => {
    const { t } = useTranslation();

    return (
        <Row className="mt-3">
            <Col className="text-center">
                <p className="text-muted">
                    {t("Don't have an account?")}{' '}
                    <Link to={'/account/register'} className="text-muted ms-1">
                        <b>{t('Sign Up')}</b>
                    </Link>
                </p>
            </Col>
        </Row>
    );
};*/

const Login = () => {
    const { t } = useTranslation();
    const eventTracker = useAnalyticsEventTracker({ category: "Account"});
    const setUserId = useGASetUserId();
    const [loggedInUser] = useUser();
    const { loading, userLoggedIn, error, schemaResolver, onSubmit, redirectUrl } = useLogin();


    if (userLoggedIn) {
        eventTracker('logged in');
        if (loggedInUser) {
            setUserId(loggedInUser.email);
        }
    }

    return (
        <>
            {userLoggedIn && <Navigate to={redirectUrl} replace />}

            {/*<AccountLayout bottomLinks={<BottomLink />}  >*/}
            <AccountLayout>
                <div className="text-center w-75 m-auto">
                    <h4 className="text-dark-50 text-center mt-0 fw-bold">{t('Sign In')}</h4>
                    <p className="text-muted mb-4">
                        {t('Welcome to Darwin, your virtual brand managment system') + '.'}
                    </p>
                </div>

                {error && (
                    <Alert variant="danger" className="my-2">
                        {t(error)}
                    </Alert>
                )}

                <VerticalForm<UserData>
                    onSubmit={onSubmit}
                    resolver={schemaResolver}
                    defaultValues={{ username: 'test@example.com', password: 'test' }}
                >
                    <FormInput
                        label={t('Username')}
                        type="text"
                        name="username"
                        placeholder={t('Enter your Username')}
                        containerClass={'mb-3'}
                    />
                    <FormInput
                        label={t('Password')}
                        type="password"
                        name="password"
                        placeholder={t('Enter your password')}
                        containerClass={'mb-3'}
                    >
                        <Link to="/account/forget-password" className="text-muted float-end">
                            <small>{t('Forgot your password?')}</small>
                        </Link>
                    </FormInput>

                    <div className="mb-3 mb-0 text-center">

                        {   !loading &&
                            <Button variant="primary" type="submit" disabled={loading}>
                                {t('Log In')}                
                            </Button>
                        }

                        {   loading && 
                            <Spinner className="m-2" color='dark' />
                        }

                    </div>
                </VerticalForm>
            </AccountLayout>
        </>
    );
};

export default Login;
