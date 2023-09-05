import { Navigate, Link } from 'react-router-dom';
import { Button, Alert, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { VerticalForm, FormInput } from 'components';
import AccountLayout from './AccountLayout';
import useSignupConfirm from './hooks/useSignupConfirm';

export type SignupConfirmData = {
    email: string;
    code: string;
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

const SignupConfirm = () => {
    const { t } = useTranslation();
    const { loading, signupConfirmSuccess, error, schemaResolver, onSubmit } = useSignupConfirm();

    return (
        <>
            {signupConfirmSuccess ? <Navigate to={'/account/login'}></Navigate> : null}

            <AccountLayout bottomLinks={<BottomLink />}>
                <div className="text-center w-75 m-auto">
                <h4 className="text-dark-50 text-center mt-4 fw-bold">{t('Confirm user')}</h4>
                </div>

                {error && (
                    <Alert variant="danger" className="my-2">
                        {error}
                    </Alert>
                )}

                <VerticalForm<SignupConfirmData> onSubmit={onSubmit} resolver={schemaResolver} defaultValues={{}}>
                    <FormInput
                        label={t('Email address')}
                        type="email"
                        name="email"
                        placeholder={t('Enter your email')}
                        containerClass={'mb-3'}
                    />
                    <FormInput
                        label={t('Verification Code')}
                        type="text"
                        name="code"
                        placeholder={t('Enter your verification code')}
                        containerClass={'mb-3'}
                    />
                    <div className="mb-3 mb-0 text-center">
                        <Button variant="primary" type="submit" disabled={loading}>
                            {t('Confirm')}
                        </Button>
                    </div>
                </VerticalForm>
            </AccountLayout>
        </>
    );
};

export default SignupConfirm;
